# FAQforge - AI-Powered FAQ Generator

## Overview

FAQforge is a full-stack web application that generates professional FAQ sections for businesses using AI. The application features a modern black-themed landing page with cool gradients and a protected dashboard where authenticated users can generate comprehensive question-answer pairs along with clean HTML/CSS code ready for implementation on their websites.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Clerk for user authentication and session management

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API for FAQ content generation
- **Session Management**: In-memory storage with fallback to PostgreSQL sessions
- **Environment Variables**: dotenv for configuration management

## Key Components

### Authentication & Security
- **Clerk Integration**: Handles user authentication, registration, and session management
- **Protected Routes**: Dashboard requires authentication to access
- **Secure API Keys**: Environment variables for OpenAI and Clerk configuration

### Data Layer
- **Database Schema**: Defined in `shared/schema.ts` using Drizzle ORM
- **FAQ Storage**: Stores business info, generated questions, and HTML/CSS code
- **Type Safety**: Zod schemas for runtime validation and TypeScript types

### API Layer
- **REST Endpoints**: Single `/api/generate-faq` endpoint for FAQ generation
- **Validation**: Request validation using Zod schemas
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Storage Abstraction**: Interface-based storage layer supporting both memory and database implementations

### Frontend Components
- **Landing Page**: Black-themed hero section with cool gradients, features, and pricing
- **Navigation**: Integrated Clerk authentication buttons
- **Dashboard**: Protected FAQ generator with clean interface
- **FAQ Generator**: Multi-step form with real-time preview
- **Code Display**: Syntax-highlighted HTML/CSS output with copy functionality
- **Responsive Design**: Mobile-first approach with dark theme

### AI Integration
- **OpenAI Integration**: GPT-4o model for intelligent FAQ generation
- **Prompt Engineering**: Structured prompts for business-specific question generation
- **Content Formatting**: Automatic HTML/CSS code generation for easy website integration

## Data Flow

1. **User Authentication**: Users must sign in/up through Clerk to access the dashboard
2. **User Input**: Business type, description, website URL, and style preferences
3. **Validation**: Client-side and server-side validation using Zod schemas
4. **AI Processing**: OpenAI generates relevant questions and answers based on business context
5. **Code Generation**: System creates styled HTML/CSS code for the FAQ section
6. **Storage**: Generated FAQ data is stored in PostgreSQL database
7. **Display**: User receives formatted output with copy-to-clipboard functionality

## External Dependencies

### Authentication Dependencies
- **@clerk/nextjs**: Authentication and user management

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **openai**: Official OpenAI API client for content generation
- **@tanstack/react-query**: Server state management and caching
- **dotenv**: Environment variable management

### UI/UX Dependencies
- **@radix-ui/***: Accessible UI primitives for React components
- **tailwindcss**: Utility-first CSS framework with dark theme
- **react-hook-form**: Performant form handling with minimal re-renders
- **react-syntax-highlighter**: Code syntax highlighting for HTML/CSS display

### Development Dependencies
- **vite**: Fast build tool with hot module replacement
- **typescript**: Static type checking
- **tsx**: TypeScript execution for development server

## Deployment Strategy

### Replit Configuration
- **Build Command**: `npm run build` - Creates production client bundle and server build
- **Start Command**: `npm run start` - Runs production server serving static files
- **Development**: `npm run dev` - Concurrent client and server development with HMR
- **Port Configuration**: Server runs on port 5000, proxied to port 80 for external access

### Environment Requirements
- **Node.js 20**: Modern JavaScript runtime
- **PostgreSQL 16**: Database for persistent storage
- **OpenAI API Key**: Required for AI content generation
- **Clerk API Keys**: Required for authentication

### Production Considerations
- **Database Migrations**: Drizzle migrations stored in `/migrations` directory
- **Static File Serving**: Client build output served from `/dist/public`
- **Error Handling**: Graceful fallbacks for AI service unavailability
- **Session Management**: PostgreSQL-backed sessions for scalability
- **Environment Variables**: Secure storage of API keys and configuration

## Recent Changes

- June 24, 2025: Major restructuring completed
  - Implemented Clerk authentication system
  - Created separate dashboard page for FAQ generation
  - Updated landing page with black theme and cool gradients
  - Moved FAQ generator to protected dashboard
  - Added environment variable management with .env file
  - Clean, professional code structure with unnecessary code removed

## User Preferences

- Preferred communication style: Simple, everyday language
- Code style: Professional, clean, and simple with unnecessary code removed
- Design preference: Black background with cool gradient colors
- Architecture preference: Separate landing page and dashboard with authentication protection