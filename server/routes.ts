import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFaqSchema } from "@shared/schema";
import { generateFaqContent } from "./services/openai";

// Middleware to extract Clerk user ID from request headers
function extractClerkUserId(req: any, res: any, next: any) {
  // Extract user ID from authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.headers['x-clerk-user-id'] = authHeader.split(' ')[1];
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate FAQ endpoint
  app.post("/api/generate-faq", async (req, res) => {
    try {
      // Get user ID from Clerk headers
      const userId = req.headers['x-clerk-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Check daily limit
      const todayCount = await storage.getUserFaqsToday(userId);
      const DAILY_LIMIT = 3;
      
      if (todayCount >= DAILY_LIMIT) {
        return res.status(429).json({ 
          message: `Daily limit reached. You can generate ${DAILY_LIMIT} FAQs per day. Your count resets at midnight.`,
          limit: DAILY_LIMIT,
          remaining: 0,
          resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
        });
      }

      const validatedData = generateFaqSchema.parse(req.body);
      
      const result = await generateFaqContent({
        businessType: validatedData.businessType,
        businessDescription: validatedData.businessDescription,
        websiteUrl: validatedData.websiteUrl || undefined,
        faqStyle: validatedData.faqStyle,
      });

      // Store the generated FAQ
      const faq = await storage.createFaq({
        userId,
        businessType: validatedData.businessType,
        businessDescription: validatedData.businessDescription,
        websiteUrl: validatedData.websiteUrl || null,
        faqStyle: validatedData.faqStyle,
        questions: result.questions,
        htmlCode: result.htmlCode,
        cssCode: result.cssCode,
      });

      res.json({
        id: faq.id,
        questions: result.questions,
        htmlCode: result.htmlCode,
        cssCode: result.cssCode,
        usage: {
          count: todayCount + 1,
          limit: DAILY_LIMIT,
          remaining: DAILY_LIMIT - (todayCount + 1)
        }
      });
    } catch (error) {
      console.error("Error generating FAQ:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("OpenAI") || error.message.includes("API")) {
          res.status(503).json({ 
            message: "AI service temporarily unavailable. Please try again in a moment." 
          });
        } else if (error.name === "ZodError") {
          res.status(400).json({ 
            message: "Invalid input data. Please check your form and try again." 
          });
        } else {
          res.status(500).json({ 
            message: "Failed to generate FAQ. Please try again." 
          });
        }
      } else {
        res.status(500).json({ 
          message: "An unexpected error occurred. Please try again." 
        });
      }
    }
  });

  // Get FAQ by ID endpoint
  app.get("/api/faq/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid FAQ ID" });
      }

      const faq = await storage.getFaq(id);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }

      res.json(faq);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      res.status(500).json({ message: "Failed to fetch FAQ" });
    }
  });

  // Apply Clerk user ID extraction middleware
  app.use(extractClerkUserId);

  const httpServer = createServer(app);
  return httpServer;
}
