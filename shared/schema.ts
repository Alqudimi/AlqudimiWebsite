import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Services
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description").notNull(),
  descriptionEn: text("description_en"),
  icon: text("icon").notNull(),
  color: text("color").notNull().default("blue"),
  features: json("features").$type<string[]>().default([]),
  featuresEn: json("features_en").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description").notNull(),
  descriptionEn: text("description_en"),
  shortDescription: text("short_description"),
  shortDescriptionEn: text("short_description_en"),
  technologies: json("technologies").$type<string[]>().default([]),
  images: json("images").$type<string[]>().default([]),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  category: text("category").notNull().default("web"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CV/Resume Data
export const cvData = pgTable("cv_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'personal', 'summary', 'education', 'experience', 'skill', 'certification', 'project'
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  subtitle: text("subtitle"), // Institution, company, etc.
  subtitleEn: text("subtitle_en"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  location: text("location"),
  locationEn: text("location_en"),
  skills: json("skills").$type<string[]>().default([]),
  level: integer("level"), // For skills 1-5
  url: text("url"),
  icon: text("icon"),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Information
export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'email', 'phone', 'social', 'address'
  label: text("label").notNull(),
  labelEn: text("label_en"),
  value: text("value").notNull(),
  icon: text("icon").notNull(),
  url: text("url"), // For social media links
  isPrimary: boolean("is_primary").default(false),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact Messages
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  serviceType: text("service_type"),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // 'unread', 'read', 'replied'
  createdAt: timestamp("created_at").defaultNow(),
});

// Site Settings
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").notNull().default("text"), // 'text', 'number', 'boolean', 'json'
  category: text("category").default("general"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  slug: text("slug").notNull().unique(),
  slugEn: text("slug_en"),
  content: text("content").notNull(),
  contentEn: text("content_en"),
  excerpt: text("excerpt"),
  excerptEn: text("excerpt_en"),
  featuredImage: text("featured_image"),
  tags: json("tags").$type<string[]>().default([]),
  tagsEn: json("tags_en").$type<string[]>().default([]),
  category: text("category").notNull().default("general"),
  categoryEn: text("category_en"),
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  viewCount: integer("view_count").default(0),
  readingTime: integer("reading_time").default(5), // minutes
  authorId: varchar("author_id").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  clientNameEn: text("client_name_en"),
  clientTitle: text("client_title"),
  clientTitleEn: text("client_title_en"),
  clientCompany: text("client_company"),
  clientCompanyEn: text("client_company_en"),
  testimonial: text("testimonial").notNull(),
  testimonialEn: text("testimonial_en"),
  rating: integer("rating").notNull().default(5), // 1-5 stars
  clientImage: text("client_image"),
  projectId: varchar("project_id").references(() => projects.id),
  isPublished: boolean("is_published").default(true),
  isFeatured: boolean("is_featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Newsletter Subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// Analytics Data
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'page_view', 'contact_form', 'project_view', 'download'
  path: text("path"),
  userAgent: text("user_agent"),
  ip: text("ip"),
  country: text("country"),
  referrer: text("referrer"),
  sessionId: text("session_id"),
  metadata: json("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  password: true,
  email: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  title: true,
  titleEn: true,
  description: true,
  descriptionEn: true,
  icon: true,
  color: true,
  features: true,
  featuresEn: true,
  isActive: true,
  order: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  titleEn: true,
  description: true,
  descriptionEn: true,
  shortDescription: true,
  shortDescriptionEn: true,
  technologies: true,
  images: true,
  liveUrl: true,
  githubUrl: true,
  category: true,
  isActive: true,
  isFeatured: true,
  order: true,
});

export const insertCvDataSchema = createInsertSchema(cvData).pick({
  type: true,
  title: true,
  titleEn: true,
  description: true,
  descriptionEn: true,
  subtitle: true,
  subtitleEn: true,
  startDate: true,
  endDate: true,
  location: true,
  locationEn: true,
  skills: true,
  level: true,
  url: true,
  icon: true,
  isActive: true,
  order: true,
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).pick({
  type: true,
  label: true,
  labelEn: true,
  value: true,
  icon: true,
  url: true,
  isPrimary: true,
  isActive: true,
  order: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  serviceType: true,
  message: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
  type: true,
  category: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  titleEn: true,
  slug: true,
  slugEn: true,
  content: true,
  contentEn: true,
  excerpt: true,
  excerptEn: true,
  featuredImage: true,
  tags: true,
  tagsEn: true,
  category: true,
  categoryEn: true,
  isPublished: true,
  isFeatured: true,
  publishedAt: true,
  readingTime: true,
  authorId: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  clientName: true,
  clientNameEn: true,
  clientTitle: true,
  clientTitleEn: true,
  clientCompany: true,
  clientCompanyEn: true,
  testimonial: true,
  testimonialEn: true,
  rating: true,
  clientImage: true,
  projectId: true,
  isPublished: true,
  isFeatured: true,
  order: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
  name: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  type: true,
  path: true,
  userAgent: true,
  ip: true,
  country: true,
  referrer: true,
  sessionId: true,
  metadata: true,
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type CvData = typeof cvData.$inferSelect;
export type InsertCvData = z.infer<typeof insertCvDataSchema>;

export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
