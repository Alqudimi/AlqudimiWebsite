import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertServiceSchema, insertProjectSchema, insertCvDataSchema, 
  insertContactInfoSchema, insertContactMessageSchema, insertSiteSettingSchema,
  insertBlogPostSchema, insertTestimonialSchema, insertNewsletterSubscriberSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware for authentication
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Public API Routes
  
  // Get all active services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get all active projects
  app.get("/api/projects", async (req, res) => {
    try {
      const { category, featured } = req.query;
      let projects;
      
      if (featured === 'true') {
        projects = await storage.getFeaturedProjects();
      } else if (category) {
        projects = await storage.getProjectsByCategory(category as string);
      } else {
        projects = await storage.getActiveProjects();
      }
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Get CV data by type
  app.get("/api/cv/:type", async (req, res) => {
    try {
      const cvData = await storage.getCvDataByType(req.params.type);
      res.json(cvData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV data" });
    }
  });

  // Get all CV data
  app.get("/api/cv", async (req, res) => {
    try {
      const cvData = await storage.getAllCvData();
      res.json(cvData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV data" });
    }
  });

  // Get contact info
  app.get("/api/contact-info", async (req, res) => {
    try {
      const contactInfo = await storage.getActiveContactInfo();
      res.json(contactInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact info" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      // TODO: Send email notification using nodemailer
      // This would require setting up SMTP credentials
      
      res.status(201).json({ 
        message: "Message sent successfully",
        id: message.id 
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  // Admin Authentication
  
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getAdminUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Protected Admin Routes
  
  // Services Management
  app.get("/api/admin/services", authenticateToken, async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create service" });
      }
    }
  });

  app.put("/api/admin/services/:id", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, validatedData);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update service" });
      }
    }
  });

  app.delete("/api/admin/services/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteService(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Projects Management
  app.get("/api/admin/projects", authenticateToken, async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/admin/projects", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create project" });
      }
    }
  });

  app.put("/api/admin/projects/:id", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update project" });
      }
    }
  });

  app.delete("/api/admin/projects/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // CV Data Management
  app.get("/api/admin/cv", authenticateToken, async (req, res) => {
    try {
      const cvData = await storage.getAllCvData();
      res.json(cvData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV data" });
    }
  });

  app.post("/api/admin/cv", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCvDataSchema.parse(req.body);
      const cvData = await storage.createCvData(validatedData);
      res.status(201).json(cvData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create CV data" });
      }
    }
  });

  app.put("/api/admin/cv/:id", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCvDataSchema.partial().parse(req.body);
      const cvData = await storage.updateCvData(req.params.id, validatedData);
      if (!cvData) {
        return res.status(404).json({ message: "CV data not found" });
      }
      res.json(cvData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update CV data" });
      }
    }
  });

  app.delete("/api/admin/cv/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteCvData(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "CV data not found" });
      }
      res.json({ message: "CV data deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete CV data" });
    }
  });

  // Contact Info Management
  app.get("/api/admin/contact-info", authenticateToken, async (req, res) => {
    try {
      const contactInfo = await storage.getAllContactInfo();
      res.json(contactInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact info" });
    }
  });

  app.post("/api/admin/contact-info", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertContactInfoSchema.parse(req.body);
      const contactInfo = await storage.createContactInfo(validatedData);
      res.status(201).json(contactInfo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create contact info" });
      }
    }
  });

  app.put("/api/admin/contact-info/:id", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertContactInfoSchema.partial().parse(req.body);
      const contactInfo = await storage.updateContactInfo(req.params.id, validatedData);
      if (!contactInfo) {
        return res.status(404).json({ message: "Contact info not found" });
      }
      res.json(contactInfo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update contact info" });
      }
    }
  });

  app.delete("/api/admin/contact-info/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteContactInfo(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Contact info not found" });
      }
      res.json({ message: "Contact info deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact info" });
    }
  });

  // Contact Messages Management
  app.get("/api/admin/messages", authenticateToken, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.put("/api/admin/messages/:id/status", authenticateToken, async (req, res) => {
    try {
      const { status } = req.body;
      const message = await storage.updateContactMessageStatus(req.params.id, status);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to update message status" });
    }
  });

  // Blog Posts - Public Routes
  app.get("/api/blog", async (req, res) => {
    try {
      const { category, featured } = req.query;
      let posts;
      
      if (featured === 'true') {
        posts = await storage.getFeaturedBlogPosts();
      } else if (category) {
        posts = await storage.getBlogPostsByCategory(category as string);
      } else {
        posts = await storage.getPublishedBlogPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Increment view count
      await storage.incrementBlogPostViews(post.id);
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Testimonials - Public Routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const { featured, projectId } = req.query;
      let testimonials;
      
      if (featured === 'true') {
        testimonials = await storage.getFeaturedTestimonials();
      } else if (projectId) {
        testimonials = await storage.getTestimonialsByProject(projectId as string);
      } else {
        testimonials = await storage.getPublishedTestimonials();
      }
      
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });


  // Newsletter Subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const parsed = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check if already subscribed
      const existing = await storage.getNewsletterSubscriberByEmail(parsed.email);
      if (existing) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
      
      const subscriber = await storage.createNewsletterSubscriber(parsed);
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      const success = await storage.unsubscribeFromNewsletter(email);
      if (!success) {
        return res.status(404).json({ message: "Email not found" });
      }
      res.json({ message: "Successfully unsubscribed from newsletter" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  // Blog Posts - Admin Routes
  app.get("/api/admin/blog", authenticateToken, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog", authenticateToken, async (req, res) => {
    try {
      const parsed = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(parsed);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/:id", authenticateToken, async (req, res) => {
    try {
      const parsed = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, parsed);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Testimonials - Admin Routes
  app.get("/api/admin/testimonials", authenticateToken, async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", authenticateToken, async (req, res) => {
    try {
      const parsed = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(parsed);
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", authenticateToken, async (req, res) => {
    try {
      const parsed = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, parsed);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteTestimonial(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Newsletter - Admin Routes
  app.get("/api/admin/newsletter", authenticateToken, async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch newsletter subscribers" });
    }
  });

  // Search API
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type, category, limit = 20 } = req.query;
      
      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json([]);
      }
      
      const searchTerm = q.toLowerCase();
      const results: any[] = [];
      
      // Search blog posts
      if (!type || type === 'blog') {
        const posts = await storage.getPublishedBlogPosts();
        posts.forEach(post => {
          if (
            post.title.toLowerCase().includes(searchTerm) ||
            post.titleEn?.toLowerCase().includes(searchTerm) ||
            post.excerpt?.toLowerCase().includes(searchTerm) ||
            post.excerptEn?.toLowerCase().includes(searchTerm) ||
            post.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            post.tagsEn?.some(tag => tag.toLowerCase().includes(searchTerm))
          ) {
            results.push({
              type: 'blog',
              id: post.id,
              title: post.title,
              titleEn: post.titleEn,
              excerpt: post.excerpt,
              excerptEn: post.excerptEn,
              url: `/blog/${post.slug}`,
              category: post.category,
              categoryEn: post.categoryEn,
              tags: post.tags,
              tagsEn: post.tagsEn,
              publishedAt: post.publishedAt || post.createdAt
            });
          }
        });
      }
      
      // Search projects
      if (!type || type === 'project') {
        const projects = await storage.getAllProjects();
        projects.filter(project => project.isActive).forEach(project => {
          if (
            project.title.toLowerCase().includes(searchTerm) ||
            project.titleEn?.toLowerCase().includes(searchTerm) ||
            project.description?.toLowerCase().includes(searchTerm) ||
            project.descriptionEn?.toLowerCase().includes(searchTerm) ||
            project.category?.toLowerCase().includes(searchTerm)
          ) {
            results.push({
              type: 'project',
              id: project.id,
              title: project.title,
              titleEn: project.titleEn,
              excerpt: project.shortDescription || project.description,
              excerptEn: project.shortDescriptionEn || project.descriptionEn,
              url: `/projects/${project.id}`,
              category: project.category,
              categoryEn: project.category
            });
          }
        });
      }
      
      // Search testimonials
      if (!type || type === 'testimonial') {
        const testimonials = await storage.getPublishedTestimonials();
        testimonials.forEach(testimonial => {
          if (
            testimonial.clientName.toLowerCase().includes(searchTerm) ||
            testimonial.clientNameEn?.toLowerCase().includes(searchTerm) ||
            testimonial.testimonial.toLowerCase().includes(searchTerm) ||
            testimonial.testimonialEn?.toLowerCase().includes(searchTerm) ||
            testimonial.clientCompany?.toLowerCase().includes(searchTerm) ||
            testimonial.clientCompanyEn?.toLowerCase().includes(searchTerm)
          ) {
            results.push({
              type: 'testimonial',
              id: testimonial.id,
              title: testimonial.clientName,
              titleEn: testimonial.clientNameEn,
              excerpt: testimonial.testimonial,
              excerptEn: testimonial.testimonialEn,
              url: '/testimonials',
              rating: testimonial.rating,
              clientName: testimonial.clientName,
              clientNameEn: testimonial.clientNameEn
            });
          }
        });
      }
      
      // Filter by category if specified
      const filteredResults = category && category !== 'all' 
        ? results.filter(result => 
            result.category === category || result.categoryEn === category
          )
        : results;
      
      // Limit results
      const limitedResults = filteredResults.slice(0, parseInt(limit as string));
      
      res.json(limitedResults);
    } catch (error) {
      console.error("Search API error:", error);
      res.status(500).json({ message: "Failed to perform search" });
    }
  });

  // Analytics - Admin Routes
  app.get("/api/admin/analytics", authenticateToken, async (req, res) => {
    try {
      const { type, days } = req.query;
      let analytics;
      
      if (type) {
        analytics = await storage.getAnalyticsByType(type as string, parseInt(days as string) || 30);
      } else {
        analytics = await storage.getPageViewStats(parseInt(days as string) || 30);
      }
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Initialize admin user with custom or default credentials
  app.post("/api/admin/init", async (req, res) => {
    try {
      // Get custom credentials from request body or use defaults
      const { username = "admin", password = "admin123", email = "admin@alqudimitech.com" } = req.body;
      
      // Validate input
      if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email are required" });
      }
      
      // Check if admin user with this username already exists
      const existingUser = await storage.getAdminUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: `Admin user '${username}' already exists` });
      }

      // Create admin user with provided or default credentials
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminUser = await storage.createAdminUser({
        username,
        password: hashedPassword,
        email
      });

      res.json({ 
        message: "Admin user created successfully",
        username: adminUser.username,
        email: adminUser.email 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to initialize admin user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}


app.post("/api/admin/init-db", async (req, res) => {
  try {
    await initializeDatabase();
    const stats = await getDatabaseStats();
    
    res.json({
      message: "Database initialized successfully",
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to initialize database",
      error: error.message 
    });
  }
});

app.get("/api/admin/db-stats", authenticateToken, async (req, res) => {
  try {
    const stats = await getDatabaseStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch database stats",
      error: error.message 
    });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const dbConnected = await checkDatabaseConnection();
    res.json({
      status: "healthy",
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message
    });
  }
});
