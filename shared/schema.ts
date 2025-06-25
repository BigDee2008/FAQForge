import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  businessType: text("business_type").notNull(),
  businessDescription: text("business_description").notNull(),
  websiteUrl: text("website_url"),
  faqStyle: text("faq_style").notNull().default("accordion"),
  questions: jsonb("questions").notNull().$type<Array<{
    question: string;
    answer: string;
  }>>(),
  htmlCode: text("html_code").notNull(),
  cssCode: text("css_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFaqSchema = createInsertSchema(faqs).pick({
  businessType: true,
  businessDescription: true,
  websiteUrl: true,
  faqStyle: true,
});

export const generateFaqSchema = z.object({
  businessType: z.string().min(1, "Business type is required"),
  businessDescription: z.string().min(10, "Please provide a detailed business description"),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  faqStyle: z.enum(["accordion", "simple"]).default("accordion"),
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type GenerateFaqRequest = z.infer<typeof generateFaqSchema>;
export type Faq = typeof faqs.$inferSelect;
export type FaqQuestion = {
  question: string;
  answer: string;
};

// Legacy user schema (keeping for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
