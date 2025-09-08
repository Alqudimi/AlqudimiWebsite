import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

neonConfig.webSocketConstructor = ws;

// Default initial data for the application
const initialData = {
  adminUser: {
    username: "admin",
    password: "admin123", // Will be hashed
    email: "admin@alqudimi.com"
  },
  services: [
    {
      title: "تطوير مواقع الويب",
      titleEn: "Web Development",
      description: "تطوير مواقع ويب متجاوبة وسريعة باستخدام أحدث التقنيات",
      descriptionEn: "Developing responsive and fast websites using the latest technologies",
      icon: "Code",
      color: "blue",
      features: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      featuresEn: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      isActive: true,
      order: 1
    },
    {
      title: "تطبيقات الهاتف المحمول",
      titleEn: "Mobile Applications",
      description: "تطوير تطبيقات هاتف محمول متقدمة لنظامي iOS و Android",
      descriptionEn: "Developing advanced mobile apps for iOS and Android",
      icon: "Smartphone",
      color: "green",
      features: ["React Native", "Flutter", "Native iOS", "Native Android"],
      featuresEn: ["React Native", "Flutter", "Native iOS", "Native Android"],
      isActive: true,
      order: 2
    },
    {
      title: "قواعد البيانات",
      titleEn: "Database Management",
      description: "تصميم وإدارة قواعد البيانات المتطورة والآمنة",
      descriptionEn: "Designing and managing advanced and secure databases",
      icon: "Database",
      color: "purple",
      features: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
      featuresEn: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
      isActive: true,
      order: 3
    }
  ],
  projects: [
    {
      title: "موقع الشركة الشخصي",
      titleEn: "Personal Company Website",
      description: "موقع ويب شخصي متطور لعرض الخدمات والمشاريع",
      descriptionEn: "Advanced personal website to showcase services and projects",
      shortDescription: "موقع شخصي متجاوب",
      shortDescriptionEn: "Responsive personal website",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
      images: [],
      liveUrl: "",
      githubUrl: "",
      category: "web",
      isActive: true,
      isFeatured: true,
      order: 1
    }
  ],
  contactInfo: [
    {
      type: "email",
      label: "البريد الإلكتروني",
      labelEn: "Email",
      value: "contact@alqudimi.com",
      icon: "Mail",
      isPrimary: true,
      isActive: true,
      order: 1
    },
    {
      type: "phone",
      label: "رقم الهاتف",
      labelEn: "Phone Number",
      value: "+966 50 123 4567",
      icon: "Phone",
      isPrimary: false,
      isActive: true,
      order: 2
    },
    {
      type: "address",
      label: "الموقع",
      labelEn: "Location",
      value: "الرياض، المملكة العربية السعودية",
      icon: "MapPin",
      isPrimary: false,
      isActive: true,
      order: 3
    }
  ],
  cvData: [
    {
      type: "personal",
      title: "عبدالعزيز محمد القديمي",
      titleEn: "Abdulaziz Mohammed Alqudimi",
      description: "مطور برمجيات متخصص في تطوير الويب والتطبيقات",
      descriptionEn: "Software developer specialized in web and app development",
      subtitle: "مطور برمجيات",
      subtitleEn: "Software Developer",
      location: "الرياض، السعودية",
      locationEn: "Riyadh, Saudi Arabia",
      skills: [],
      isActive: true,
      order: 1
    },
    {
      type: "skill",
      title: "React",
      titleEn: "React",
      description: "مكتبة جافا سكريبت لبناء واجهات المستخدم",
      descriptionEn: "JavaScript library for building user interfaces",
      level: 5,
      icon: "Code",
      skills: ["React", "Redux", "Context API", "Hooks"],
      isActive: true,
      order: 1
    },
    {
      type: "skill",
      title: "Node.js",
      titleEn: "Node.js",
      description: "بيئة تشغيل جافا سكريبت للخادم",
      descriptionEn: "JavaScript runtime for server-side development",
      level: 4,
      icon: "Server",
      skills: ["Express", "NestJS", "API Development", "Database Integration"],
      isActive: true,
      order: 2
    }
  ],
  siteSettings: [
    {
      key: "site_name",
      value: "تقنية القديمي - Alqudimi Technology",
      category: "general",
      description: "اسم الموقع",
      descriptionEn: "Site name"
    },
    {
      key: "site_description",
      value: "تطوير مواقع ويب وتطبيقات متقدمة",
      category: "general",
      description: "وصف الموقع",
      descriptionEn: "Site description"
    },
    {
      key: "theme_color",
      value: "#3B82F6",
      category: "appearance",
      description: "اللون الأساسي للموقع",
      descriptionEn: "Primary site color"
    }
  ]
};

export class DatabaseInitializer {
  private db: ReturnType<typeof drizzle> | null = null;
  private isConnected = false;

  constructor() {}

  /**
   * Test database connection
   */
  async testConnection(databaseUrl: string): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      const pool = new Pool({ 
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'development' ? false : true,
        connectionTimeoutMillis: 5000
      });
      
      this.db = drizzle({ client: pool, schema });
      
      // Test the connection with a simple query
      await pool.query('SELECT 1');
      
      this.isConnected = true;
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.warn('⚠️ Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Initialize database with schema and initial data
   */
  async initializeDatabase(): Promise<boolean> {
    if (!this.db || !this.isConnected) {
      console.warn('❌ Cannot initialize database - no connection');
      return false;
    }

    try {
      console.log('🔄 Initializing database...');
      
      // Always ensure admin user exists, especially important for production
      await this.ensureAdminUserExists();
      
      // Check if other data already exists
      const existingServices = await this.db.select()
        .from(schema.services)
        .limit(1);

      if (existingServices.length === 0) {
        await this.seedInitialData();
        console.log('✅ Database initialized with initial data');
      } else {
        console.log('ℹ️ Database already contains data, skipping additional seeding');
      }

      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      return false;
    }
  }

  /**
   * Ensure admin user exists - critical for production deployments
   */
  async ensureAdminUserExists(): Promise<void> {
    if (!this.db) return;

    try {
      const existingAdmin = await this.db.select()
        .from(schema.adminUsers)
        .where(schema.eq(schema.adminUsers.username, initialData.adminUser.username))
        .limit(1);

      if (existingAdmin.length === 0) {
        const hashedPassword = await bcrypt.hash(initialData.adminUser.password, 10);
        await this.db.insert(schema.adminUsers).values({
          username: initialData.adminUser.username,
          password: hashedPassword,
          email: initialData.adminUser.email
        });
        console.log('✅ Admin user created (production-safe)');
      } else {
        console.log('ℹ️ Admin user already exists');
      }
    } catch (error) {
      console.error('❌ Failed to ensure admin user exists:', error);
      throw error;
    }
  }

  /**
   * Seed initial data into the database
   */
  private async seedInitialData(): Promise<void> {
    if (!this.db) return;

    try {
      // Admin user is handled separately in ensureAdminUserExists

      // Create services
      for (const service of initialData.services) {
        await this.db.insert(schema.services).values(service);
      }
      console.log('✅ Services created');

      // Create projects
      for (const project of initialData.projects) {
        await this.db.insert(schema.projects).values(project);
      }
      console.log('✅ Projects created');

      // Create contact info
      for (const contact of initialData.contactInfo) {
        await this.db.insert(schema.contactInfo).values(contact);
      }
      console.log('✅ Contact info created');

      // Create CV data
      for (const cv of initialData.cvData) {
        await this.db.insert(schema.cvData).values(cv);
      }
      console.log('✅ CV data created');

      // Create site settings
      for (const setting of initialData.siteSettings) {
        await this.db.insert(schema.siteSettings).values(setting);
      }
      console.log('✅ Site settings created');

    } catch (error) {
      console.error('❌ Failed to seed initial data:', error);
      throw error;
    }
  }

  /**
   * Get the database instance if connected
   */
  getDatabase(): ReturnType<typeof drizzle> | null {
    return this.isConnected ? this.db : null;
  }

  /**
   * Check if database is connected
   */
  isDbConnected(): boolean {
    return this.isConnected;
  }
}