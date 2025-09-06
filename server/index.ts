import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    service: "Alqudimi Technology API"
  });
});

// Main server initialization
(async () => {
  try {
    // Initialize database first
    log("🔄 Initializing database...");
    await initializeDatabase();
    log("✅ Database initialized successfully");

    // Register all API routes
    const server = await registerRoutes(app);

    // Global error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error('❌ Server error:', err);
      res.status(status).json({ 
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    // Handle 404 routes
    app.use((_req: Request, res: Response) => {
      res.status(404).json({ 
        message: "Endpoint not found",
        documentation: "Check /api endpoints for available routes"
      });
    });

    // Setup Vite in development or serve static files in production
    if (app.get("env") === "development") {
      log("🚀 Starting in development mode with Vite...");
      await setupVite(app, server);
    } else {
      log("🏗️  Serving static files in production...");
      serveStatic(app);
    }

    // Get port from environment variable or default to 5000 for Render
    const port = parseInt(process.env.PORT || '5000', 10);
    
    // Start the server
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`🎉 Server successfully started on port ${port}`);
      log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`📊 API endpoints available at: http://localhost:${port}/api`);
      log(`❤️  Health check: http://localhost:${port}/health`);
      
      // Also log to console for Render logs
      console.log(`✅ Server is listening on port ${port}`);
      console.log(`🚀 Alqudimi Technology API is running!`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
