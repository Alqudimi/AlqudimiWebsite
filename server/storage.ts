import { 
  adminUsers, services, projects, cvData, contactInfo, contactMessages, siteSettings,
  blogPosts, testimonials, newsletterSubscribers, analytics,
  type AdminUser, type InsertAdminUser, type Service, type InsertService, 
  type Project, type InsertProject, type CvData, type InsertCvData,
  type ContactInfo, type InsertContactInfo, type ContactMessage, type InsertContactMessage,
  type SiteSetting, type InsertSiteSetting, type BlogPost, type InsertBlogPost,
  type Testimonial, type InsertTestimonial, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type Analytics, type InsertAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // Admin Users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Services
  getAllServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getActiveProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // CV Data
  getCvDataByType(type: string): Promise<CvData[]>;
  getAllCvData(): Promise<CvData[]>;
  getCvDataItem(id: string): Promise<CvData | undefined>;
  createCvData(cvData: InsertCvData): Promise<CvData>;
  updateCvData(id: string, cvData: Partial<InsertCvData>): Promise<CvData | undefined>;
  deleteCvData(id: string): Promise<boolean>;

  // Contact Info
  getAllContactInfo(): Promise<ContactInfo[]>;
  getActiveContactInfo(): Promise<ContactInfo[]>;
  getContactInfo(id: string): Promise<ContactInfo | undefined>;
  createContactInfo(contactInfo: InsertContactInfo): Promise<ContactInfo>;
  updateContactInfo(id: string, contactInfo: Partial<InsertContactInfo>): Promise<ContactInfo | undefined>;
  deleteContactInfo(id: string): Promise<boolean>;

  // Contact Messages
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessageStatus(id: string, status: string): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: string): Promise<boolean>;

  // Site Settings
  getAllSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingsByCategory(category: string): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined>;
  deleteSiteSetting(key: string): Promise<boolean>;

  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  incrementBlogPostViews(id: string): Promise<void>;

  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getPublishedTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  getTestimonialsByProject(projectId: string): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Newsletter
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getActiveNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriber(id: string): Promise<NewsletterSubscriber | undefined>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  unsubscribeFromNewsletter(email: string): Promise<boolean>;

  // Analytics
  createAnalyticsEntry(entry: InsertAnalytics): Promise<Analytics>;
  getAnalyticsByType(type: string, days?: number): Promise<Analytics[]>;
  getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<Analytics[]>;
  getPageViewStats(days?: number): Promise<{ path: string; views: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // Admin Users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(insertUser).returning();
    return user;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(asc(services.order));
  }

  async getActiveServices(): Promise<Service[]> {
    return await db.select().from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.order));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const insertData: any = {
      ...service,
      features: service.features || [],
      featuresEn: service.featuresEn || []
    };
    const [newService] = await db.insert(services).values(insertData).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const updateData: any = {
      ...service,
      updatedAt: new Date()
    };
    const [updated] = await db.update(services)
      .set(updateData)
      .where(eq(services.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getActiveProjects(): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.isActive, true))
      .orderBy(asc(projects.order), desc(projects.createdAt));
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.isFeatured, true))
      .orderBy(asc(projects.order));
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.category, category))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const insertData: any = {
      ...project,
      technologies: project.technologies || [],
      images: project.images || []
    };
    const [newProject] = await db.insert(projects).values(insertData).returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const updateData: any = {
      ...project,
      updatedAt: new Date()
    };
    const [updated] = await db.update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // CV Data
  async getCvDataByType(type: string): Promise<CvData[]> {
    return await db.select().from(cvData)
      .where(eq(cvData.type, type))
      .orderBy(asc(cvData.order));
  }

  async getAllCvData(): Promise<CvData[]> {
    return await db.select().from(cvData).orderBy(asc(cvData.order));
  }

  async getCvDataItem(id: string): Promise<CvData | undefined> {
    const [item] = await db.select().from(cvData).where(eq(cvData.id, id));
    return item || undefined;
  }

  async createCvData(cvDataItem: InsertCvData): Promise<CvData> {
    const insertData: any = {
      ...cvDataItem,
      skills: cvDataItem.skills || []
    };
    const [newItem] = await db.insert(cvData).values(insertData).returning();
    return newItem;
  }

  async updateCvData(id: string, cvDataItem: Partial<InsertCvData>): Promise<CvData | undefined> {
    const updateData: any = {
      ...cvDataItem,
      updatedAt: new Date()
    };
    const [updated] = await db.update(cvData)
      .set(updateData)
      .where(eq(cvData.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCvData(id: string): Promise<boolean> {
    const result = await db.delete(cvData).where(eq(cvData.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Contact Info
  async getAllContactInfo(): Promise<ContactInfo[]> {
    return await db.select().from(contactInfo).orderBy(asc(contactInfo.order));
  }

  async getActiveContactInfo(): Promise<ContactInfo[]> {
    return await db.select().from(contactInfo)
      .where(eq(contactInfo.isActive, true))
      .orderBy(asc(contactInfo.order));
  }

  async getContactInfo(id: string): Promise<ContactInfo | undefined> {
    const [info] = await db.select().from(contactInfo).where(eq(contactInfo.id, id));
    return info || undefined;
  }

  async createContactInfo(contactInfoItem: InsertContactInfo): Promise<ContactInfo> {
    const [newInfo] = await db.insert(contactInfo).values(contactInfoItem).returning();
    return newInfo;
  }

  async updateContactInfo(id: string, contactInfoItem: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    const [updated] = await db.update(contactInfo)
      .set(contactInfoItem)
      .where(eq(contactInfo.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteContactInfo(id: string): Promise<boolean> {
    const result = await db.delete(contactInfo).where(eq(contactInfo.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async updateContactMessageStatus(id: string, status: string): Promise<ContactMessage | undefined> {
    const [updated] = await db.update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Site Settings
  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSettingsByCategory(category: string): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings).where(eq(siteSettings.category, category));
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [newSetting] = await db.insert(siteSettings).values(setting).returning();
    return newSetting;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined> {
    const [updated] = await db.update(siteSettings)
      .set({ value })
      .where(eq(siteSettings.key, key))
      .returning();
    return updated || undefined;
  }

  async deleteSiteSetting(key: string): Promise<boolean> {
    const result = await db.delete(siteSettings).where(eq(siteSettings.key, key));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.isFeatured, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.category, category))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const insertData: any = {
      ...post,
      tags: post.tags || [],
      tagsEn: post.tagsEn || []
    };
    const [newPost] = await db.insert(blogPosts).values(insertData).returning();
    return newPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData: any = {
      ...post,
      updatedAt: new Date()
    };
    const [updated] = await db.update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async incrementBlogPostViews(id: string): Promise<void> {
    await db.update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, id));
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(asc(testimonials.order));
  }

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(asc(testimonials.order));
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.isFeatured, true))
      .orderBy(asc(testimonials.order));
  }

  async getTestimonialsByProject(projectId: string): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.projectId, projectId))
      .orderBy(asc(testimonials.order));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial || undefined;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const updateData: any = {
      ...testimonial,
      updatedAt: new Date()
    };
    const [updated] = await db.update(testimonials)
      .set(updateData)
      .where(eq(testimonials.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Newsletter
  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
  }

  async getActiveNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, true))
      .orderBy(desc(newsletterSubscribers.subscribedAt));
  }

  async getNewsletterSubscriber(id: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return subscriber || undefined;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return subscriber || undefined;
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return newSubscriber;
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const result = await db.update(newsletterSubscribers)
      .set({ 
        isActive: false,
        unsubscribedAt: new Date()
      })
      .where(eq(newsletterSubscribers.email, email));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Analytics
  async createAnalyticsEntry(entry: InsertAnalytics): Promise<Analytics> {
    const insertData: any = {
      ...entry,
      metadata: entry.metadata || {}
    };
    const [newEntry] = await db.insert(analytics).values(insertData).returning();
    return newEntry;
  }

  async getAnalyticsByType(type: string, days: number = 30): Promise<Analytics[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return await db.select().from(analytics)
      .where(eq(analytics.type, type))
      .orderBy(desc(analytics.createdAt));
  }

  async getAnalyticsByDateRange(startDate: Date, endDate: Date): Promise<Analytics[]> {
    return await db.select().from(analytics)
      .orderBy(desc(analytics.createdAt));
  }

  async getPageViewStats(days: number = 30): Promise<{ path: string; views: number }[]> {
    // This would normally use a more complex query with GROUP BY
    // For now, returning a simplified version
    const entries = await this.getAnalyticsByType('page_view', days);
    const pathCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (entry.path) {
        pathCounts[entry.path] = (pathCounts[entry.path] || 0) + 1;
      }
    });
    
    return Object.entries(pathCounts).map(([path, views]) => ({ path, views }));
  }
}

export const storage = new DatabaseStorage();
