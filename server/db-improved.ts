import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import bcrypt from "bcrypt";

neonConfig.webSocketConstructor = ws;

let db: ReturnType<typeof drizzle> | null = null;
let isConnected = false;
let hasBeenInitialized = false;

/**
 * Initialize database connection with fallback mechanism
 */
async function initializeDatabase(): Promise<boolean> {
  if (hasBeenInitialized) {
    return isConnected;
  }

  console.log('🚀 Initializing database system...');

  if (!process.env.DATABASE_URL) {
    console.log('ℹ️ No DATABASE_URL found, will use memory fallback when needed');
    hasBeenInitialized = true;
    isConnected = false;
    return false;
  }

  try {
    // Configure for development environment
    if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    console.log('📊 Attempting database connection...');
    
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'development' ? false : true,
      connectionTimeoutMillis: 5000
    });
    
    db = drizzle({ client: pool, schema });
    
    // Test the connection
    await pool.query('SELECT 1');
    
    isConnected = true;
    hasBeenInitialized = true;
    
    console.log('✅ Database connection successful');
    
    // Initialize with default data if needed
    await seedDefaultData();
    
    return true;
  } catch (error) {
    console.warn('⚠️ Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
    console.warn('🧠 Will use memory fallback for data storage');
    
    isConnected = false;
    hasBeenInitialized = true;
    db = null;
    
    return false;
  }
}

/**
 * Seed default data if database is empty
 */
async function seedDefaultData(): Promise<void> {
  if (!db || !isConnected) return;

  try {
    // Check if admin user exists
    const existingAdmin = await db.select().from(schema.adminUsers).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('ℹ️ Database already contains data, skipping initialization');
      return;
    }

    console.log('🌱 Seeding initial data...');

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(schema.adminUsers).values({
      username: "admin",
      password: hashedPassword,
      email: "admin@alqudimi.com"
    });
    
    // Create default services
    await db.insert(schema.services).values([
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
    ]);
    
    // Create default project
    await db.insert(schema.projects).values({
      title: "موقع الشركة الشخصي",
      titleEn: "Personal Company Website",
      description: "موقع ويب شخصي متطور لعرض الخدمات والمشاريع مع دعم اللغتين العربية والإنجليزية",
      descriptionEn: "Advanced personal website to showcase services and projects with Arabic and English support",
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
    });
    
    // Create contact info
    await db.insert(schema.contactInfo).values([
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
    ]);
    
    // Create CV data
    await db.insert(schema.cvData).values([
      {
        type: "personal",
        title: "عبدالعزيز محمد القديمي",
        titleEn: "Abdulaziz Mohammed Alqudimi",
        description: "مطور برمجيات متخصص في تطوير الويب والتطبيقات بخبرة واسعة في التقنيات الحديثة",
        descriptionEn: "Software developer specialized in web and app development with extensive experience in modern technologies",
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
        description: "مكتبة جافا سكريبت لبناء واجهات المستخدم التفاعلية",
        descriptionEn: "JavaScript library for building interactive user interfaces",
        level: 5,
        icon: "Code",
        skills: ["React", "Redux", "Context API", "Hooks", "JSX"],
        isActive: true,
        order: 1
      },
      {
        type: "skill",
        title: "Node.js",
        titleEn: "Node.js",
        description: "بيئة تشغيل جافا سكريبت للخادم مع إمكانيات متقدمة",
        descriptionEn: "JavaScript runtime for server-side development with advanced capabilities",
        level: 4,
        icon: "Server",
        skills: ["Express", "NestJS", "API Development", "Database Integration"],
        isActive: true,
        order: 2
      }
    ]);
    
    // Create site settings
    await db.insert(schema.siteSettings).values([
      {
        key: "site_name",
        value: "تقنية القديمي - Alqudimi Technology",
        category: "general",
        description: "اسم الموقع",
        descriptionEn: "Site name"
      },
      {
        key: "site_description",
        value: "تطوير مواقع ويب وتطبيقات متقدمة بأحدث التقنيات",
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
      },
      {
        key: "contact_email",
        value: "contact@alqudimi.com",
        category: "contact",
        description: "البريد الإلكتروني للتواصل",
        descriptionEn: "Contact email address"
      }
    ]);

    console.log('✅ Initial data seeded successfully');

  } catch (error) {
    console.error('❌ Failed to seed initial data:', error);
  }
}

/**
 * Get database instance, initializing if needed
 */
export async function getDB(): Promise<ReturnType<typeof drizzle> | null> {
  if (!hasBeenInitialized) {
    await initializeDatabase();
  }
  return db;
}

/**
 * Check if database is connected
 */
export function isDatabaseConnected(): boolean {
  return isConnected;
}

/**
 * Get connection status
 */
export function getConnectionStatus(): {
  connected: boolean;
  initialized: boolean;
  type: 'database' | 'memory' | 'not_initialized';
} {
  return {
    connected: isConnected,
    initialized: hasBeenInitialized,
    type: hasBeenInitialized ? (isConnected ? 'database' : 'memory') : 'not_initialized'
  };
}