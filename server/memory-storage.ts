import { 
  type AdminUser, type InsertAdminUser, type Service, type InsertService, 
  type Project, type InsertProject, type CvData, type InsertCvData,
  type ContactInfo, type InsertContactInfo, type ContactMessage, type InsertContactMessage,
  type SiteSetting, type InsertSiteSetting, type BlogPost, type InsertBlogPost,
  type Testimonial, type InsertTestimonial, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type Analytics, type InsertAnalytics
} from "@shared/schema";
import { IStorage } from "./storage";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

/**
 * In-memory storage implementation as fallback when database is not available
 */
export class MemoryStorage implements IStorage {
  private adminUsers: AdminUser[] = [];
  private services: Service[] = [];
  private projects: Project[] = [];
  private cvData: CvData[] = [];
  private contactInfo: ContactInfo[] = [];
  private contactMessages: ContactMessage[] = [];
  private siteSettings: SiteSetting[] = [];
  private blogPosts: BlogPost[] = [];
  private testimonials: Testimonial[] = [];
  private newsletterSubscribers: NewsletterSubscriber[] = [];
  private analytics: Analytics[] = [];

  private isInitialized = false;

  constructor() {
    this.initializeWithDefaults();
  }

  /**
   * Initialize with default data
   */
  private async initializeWithDefaults() {
    if (this.isInitialized) return;

    try {
      console.log('🔄 Initializing memory storage with default data...');
      
      // Create default admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      this.adminUsers.push({
        id: nanoid(),
        username: "admin",
        password: hashedPassword,
        email: "admin@alqudimi.com",
        createdAt: new Date()
      });

      // Default services
      this.services.push(
        {
          id: nanoid(),
          title: "تطوير مواقع الويب",
          titleEn: "Web Development",
          description: "تطوير مواقع ويب متجاوبة وسريعة باستخدام أحدث التقنيات",
          descriptionEn: "Developing responsive and fast websites using the latest technologies",
          icon: "Code",
          color: "blue",
          features: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          featuresEn: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          isActive: true,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: nanoid(),
          title: "تطبيقات الهاتف المحمول",
          titleEn: "Mobile Applications", 
          description: "تطوير تطبيقات هاتف محمول متقدمة لنظامي iOS و Android",
          descriptionEn: "Developing advanced mobile apps for iOS and Android",
          icon: "Smartphone",
          color: "green",
          features: ["React Native", "Flutter", "Native iOS", "Native Android"],
          featuresEn: ["React Native", "Flutter", "Native iOS", "Native Android"],
          isActive: true,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: nanoid(),
          title: "قواعد البيانات",
          titleEn: "Database Management",
          description: "تصميم وإدارة قواعد البيانات المتطورة والآمنة",
          descriptionEn: "Designing and managing advanced and secure databases",
          icon: "Database",
          color: "purple",
          features: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
          featuresEn: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
          isActive: true,
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );

      // Default projects
      this.projects.push({
        id: nanoid(),
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
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Default contact info
      this.contactInfo.push(
        {
          id: nanoid(),
          type: "email",
          label: "البريد الإلكتروني",
          labelEn: "Email",
          value: "contact@alqudimi.com",
          icon: "Mail",
          url: undefined,
          isPrimary: true,
          isActive: true,
          order: 1,
          createdAt: new Date()
        },
        {
          id: nanoid(),
          type: "phone",
          label: "رقم الهاتف",
          labelEn: "Phone Number",
          value: "+966 50 123 4567",
          icon: "Phone",
          url: undefined,
          isPrimary: false,
          isActive: true,
          order: 2,
          createdAt: new Date()
        },
        {
          id: nanoid(),
          type: "address",
          label: "الموقع",
          labelEn: "Location",
          value: "الرياض، المملكة العربية السعودية",
          icon: "MapPin",
          url: undefined,
          isPrimary: false,
          isActive: true,
          order: 3,
          createdAt: new Date()
        }
      );

      // Default CV data
      this.cvData.push(
        {
          id: nanoid(),
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
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: nanoid(),
          type: "skill",
          title: "React",
          titleEn: "React",
          description: "مكتبة جافا سكريبت لبناء واجهات المستخدم التفاعلية",
          descriptionEn: "JavaScript library for building interactive user interfaces",
          level: 5,
          icon: "Code",
          skills: ["React", "Redux", "Context API", "Hooks", "JSX"],
          isActive: true,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: nanoid(),
          type: "skill",
          title: "Node.js",
          titleEn: "Node.js",
          description: "بيئة تشغيل جافا سكريبت للخادم مع إمكانيات متقدمة",
          descriptionEn: "JavaScript runtime for server-side development with advanced capabilities",
          level: 4,
          icon: "Server",
          skills: ["Express", "NestJS", "API Development", "Database Integration"],
          isActive: true,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );

      // Default site settings
      this.siteSettings.push(
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
      );

      this.isInitialized = true;
      console.log('✅ Memory storage initialized with default data');
    } catch (error) {
      console.error('❌ Failed to initialize memory storage:', error);
    }
  }

  // Admin Users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.find(user => user.id === id);
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return this.adminUsers.find(user => user.username === username);
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const newUser: AdminUser = {
      id: nanoid(),
      ...user,
      createdAt: new Date()
    };
    this.adminUsers.push(newUser);
    return newUser;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return [...this.services].sort((a, b) => a.order - b.order);
  }

  async getActiveServices(): Promise<Service[]> {
    return this.services.filter(s => s.isActive).sort((a, b) => a.order - b.order);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.find(s => s.id === id);
  }

  async createService(service: InsertService): Promise<Service> {
    const newService: Service = {
      id: nanoid(),
      ...service,
      features: service.features || [],
      featuresEn: service.featuresEn || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.push(newService);
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    this.services[index] = {
      ...this.services[index],
      ...service,
      updatedAt: new Date()
    };
    return this.services[index];
  }

  async deleteService(id: string): Promise<boolean> {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.services.splice(index, 1);
    return true;
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return [...this.projects].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getActiveProjects(): Promise<Project[]> {
    return this.projects
      .filter(p => p.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.projects
      .filter(p => p.isFeatured)
      .sort((a, b) => a.order - b.order);
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return this.projects
      .filter(p => p.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.find(p => p.id === id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      id: nanoid(),
      ...project,
      technologies: project.technologies || [],
      images: project.images || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.projects[index] = {
      ...this.projects[index],
      ...project,
      updatedAt: new Date()
    };
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.projects.splice(index, 1);
    return true;
  }

  // CV Data
  async getCvDataByType(type: string): Promise<CvData[]> {
    return this.cvData
      .filter(cv => cv.type === type)
      .sort((a, b) => a.order - b.order);
  }

  async getAllCvData(): Promise<CvData[]> {
    return [...this.cvData].sort((a, b) => a.order - b.order);
  }

  async getCvDataItem(id: string): Promise<CvData | undefined> {
    return this.cvData.find(cv => cv.id === id);
  }

  async createCvData(cvDataItem: InsertCvData): Promise<CvData> {
    const newCvData: CvData = {
      id: nanoid(),
      ...cvDataItem,
      skills: cvDataItem.skills || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cvData.push(newCvData);
    return newCvData;
  }

  async updateCvData(id: string, cvDataItem: Partial<InsertCvData>): Promise<CvData | undefined> {
    const index = this.cvData.findIndex(cv => cv.id === id);
    if (index === -1) return undefined;
    
    this.cvData[index] = {
      ...this.cvData[index],
      ...cvDataItem,
      updatedAt: new Date()
    };
    return this.cvData[index];
  }

  async deleteCvData(id: string): Promise<boolean> {
    const index = this.cvData.findIndex(cv => cv.id === id);
    if (index === -1) return false;
    
    this.cvData.splice(index, 1);
    return true;
  }

  // Contact Info
  async getAllContactInfo(): Promise<ContactInfo[]> {
    return [...this.contactInfo].sort((a, b) => a.order - b.order);
  }

  async getActiveContactInfo(): Promise<ContactInfo[]> {
    return this.contactInfo
      .filter(info => info.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async getContactInfo(id: string): Promise<ContactInfo | undefined> {
    return this.contactInfo.find(info => info.id === id);
  }

  async createContactInfo(contactInfoItem: InsertContactInfo): Promise<ContactInfo> {
    const newInfo: ContactInfo = {
      id: nanoid(),
      ...contactInfoItem
    };
    this.contactInfo.push(newInfo);
    return newInfo;
  }

  async updateContactInfo(id: string, contactInfoItem: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    const index = this.contactInfo.findIndex(info => info.id === id);
    if (index === -1) return undefined;
    
    this.contactInfo[index] = {
      ...this.contactInfo[index],
      ...contactInfoItem
    };
    return this.contactInfo[index];
  }

  async deleteContactInfo(id: string): Promise<boolean> {
    const index = this.contactInfo.findIndex(info => info.id === id);
    if (index === -1) return false;
    
    this.contactInfo.splice(index, 1);
    return true;
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return [...this.contactMessages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    return this.contactMessages.find(msg => msg.id === id);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: nanoid(),
      ...message,
      createdAt: new Date()
    };
    this.contactMessages.push(newMessage);
    return newMessage;
  }

  async updateContactMessageStatus(id: string, status: string): Promise<ContactMessage | undefined> {
    const index = this.contactMessages.findIndex(msg => msg.id === id);
    if (index === -1) return undefined;
    
    this.contactMessages[index] = {
      ...this.contactMessages[index],
      status
    };
    return this.contactMessages[index];
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const index = this.contactMessages.findIndex(msg => msg.id === id);
    if (index === -1) return false;
    
    this.contactMessages.splice(index, 1);
    return true;
  }

  // Site Settings
  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return [...this.siteSettings];
  }

  async getSiteSettingsByCategory(category: string): Promise<SiteSetting[]> {
    return this.siteSettings.filter(setting => setting.category === category);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    return this.siteSettings.find(setting => setting.key === key);
  }

  async createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const newSetting: SiteSetting = {
      ...setting
    };
    this.siteSettings.push(newSetting);
    return newSetting;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined> {
    const index = this.siteSettings.findIndex(setting => setting.key === key);
    if (index === -1) return undefined;
    
    this.siteSettings[index] = {
      ...this.siteSettings[index],
      value
    };
    return this.siteSettings[index];
  }

  async deleteSiteSetting(key: string): Promise<boolean> {
    const index = this.siteSettings.findIndex(setting => setting.key === key);
    if (index === -1) return false;
    
    this.siteSettings.splice(index, 1);
    return true;
  }

  // Blog Posts (simplified implementations)
  async getAllBlogPosts(): Promise<BlogPost[]> { return []; }
  async getPublishedBlogPosts(): Promise<BlogPost[]> { return []; }
  async getFeaturedBlogPosts(): Promise<BlogPost[]> { return []; }
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> { return []; }
  async getBlogPost(id: string): Promise<BlogPost | undefined> { return undefined; }
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> { return undefined; }
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> { throw new Error('Not implemented in memory storage'); }
  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> { return undefined; }
  async deleteBlogPost(id: string): Promise<boolean> { return false; }
  async incrementBlogPostViews(id: string): Promise<void> { }

  // Testimonials (simplified implementations)
  async getAllTestimonials(): Promise<Testimonial[]> { return []; }
  async getPublishedTestimonials(): Promise<Testimonial[]> { return []; }
  async getFeaturedTestimonials(): Promise<Testimonial[]> { return []; }
  async getTestimonialsByProject(projectId: string): Promise<Testimonial[]> { return []; }
  async getTestimonial(id: string): Promise<Testimonial | undefined> { return undefined; }
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> { throw new Error('Not implemented in memory storage'); }
  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> { return undefined; }
  async deleteTestimonial(id: string): Promise<boolean> { return false; }

  // Newsletter (simplified implementations)
  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> { return []; }
  async getActiveNewsletterSubscribers(): Promise<NewsletterSubscriber[]> { return []; }
  async getNewsletterSubscriber(id: string): Promise<NewsletterSubscriber | undefined> { return undefined; }
  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> { return undefined; }
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> { throw new Error('Not implemented in memory storage'); }
  async unsubscribeFromNewsletter(email: string): Promise<boolean> { return false; }

  // Analytics (simplified implementations)
  async createAnalyticsEntry(entry: InsertAnalytics): Promise<Analytics> { throw new Error('Not implemented in memory storage'); }
  async getAnalyticsByType(type: string, days?: number): Promise<Analytics[]> { return []; }
  async getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<Analytics[]> { return []; }
  async getPageViewStats(days?: number): Promise<{ path: string; views: number }[]> { return []; }
}