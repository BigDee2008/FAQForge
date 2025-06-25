import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFaqSchema } from "@shared/schema";
import { generateFaqContent } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate FAQ endpoint
  app.post("/api/generate-faq", async (req, res) => {
    try {
      const validatedData = generateFaqSchema.parse(req.body);
      
      const result = await generateFaqContent({
        businessType: validatedData.businessType,
        businessDescription: validatedData.businessDescription,
        websiteUrl: validatedData.websiteUrl || undefined,
        faqStyle: validatedData.faqStyle,
      });

      // Store the generated FAQ
      const faq = await storage.createFaq({
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

  const httpServer = createServer(app);
  return httpServer;
}
