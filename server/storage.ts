import { faqs, users, type Faq, type InsertFaq, type User, type InsertUser, type FaqQuestion } from "@shared/schema";

export interface IStorage {
  // FAQ methods
  createFaq(faq: Omit<InsertFaq, 'id' | 'createdAt'> & { 
    questions: FaqQuestion[];
    htmlCode: string;
    cssCode: string;
  }): Promise<Faq>;
  getFaq(id: number): Promise<Faq | undefined>;
  
  // User methods (legacy)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private faqs: Map<number, Faq>;
  private users: Map<number, User>;
  private currentFaqId: number;
  private currentUserId: number;

  constructor() {
    this.faqs = new Map();
    this.users = new Map();
    this.currentFaqId = 1;
    this.currentUserId = 1;
  }

  // FAQ methods
  async createFaq(faqData: Omit<InsertFaq, 'id' | 'createdAt'> & { 
    questions: FaqQuestion[];
    htmlCode: string;
    cssCode: string;
  }): Promise<Faq> {
    const id = this.currentFaqId++;
    const faq: Faq = {
      ...faqData,
      id,
      createdAt: new Date(),
    };
    this.faqs.set(id, faq);
    return faq;
  }

  async getFaq(id: number): Promise<Faq | undefined> {
    return this.faqs.get(id);
  }

  // User methods (legacy)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
