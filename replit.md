# Alqudimi Technology Portfolio Website

## Overview

This is a full-stack professional portfolio website for software developer عبدالعزيز محمد القديمي (Abdulaziz Mohammed Alqudimi). The project showcases programming services, projects, CV information, and provides contact functionality. Built with a modern tech stack, it features a bilingual interface (Arabic/English), sound effects, theme switching, and a comprehensive admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for robust form handling
- **UI Components**: Radix UI primitives through shadcn/ui for accessible, customizable components
- **Theming**: Custom theme provider supporting dark/light modes with CSS variables
- **Sound System**: Custom sound manager for interactive audio feedback
- **Internationalization**: Bilingual support (Arabic RTL/English LTR) built into component structure

### Backend Architecture
- **Framework**: Express.js with TypeScript for API development
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API with comprehensive CRUD operations for all content types
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Middleware**: Request logging, CORS handling, and body parsing

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Data Modeling**: Comprehensive schema covering services, projects, CV data, contact info, messages, and site settings
- **Relationships**: Properly normalized database with foreign key constraints
- **Connection Pooling**: Neon serverless connection pooling for optimal performance

### Authentication and Authorization
- **Admin Authentication**: JWT token-based system for admin panel access
- **Password Security**: bcrypt hashing with salt rounds for secure password storage
- **Session Management**: Stateless JWT approach with token validation middleware
- **Route Protection**: Protected admin routes with authentication middleware
- **Local Storage**: Client-side token storage with automatic auth state management

### Content Management System
- **Admin Panel**: Full-featured dashboard for managing all website content
- **CRUD Operations**: Complete create, read, update, delete functionality for all entities
- **Form Validation**: Comprehensive validation using Zod schemas on both client and server
- **Media Management**: Image URL handling and validation for project galleries
- **Ordering System**: Drag-and-drop ordering for services, projects, and CV items
- **Status Management**: Active/inactive toggles for content visibility control

### Performance and User Experience
- **Code Splitting**: Vite-based build system with automatic code splitting
- **Lazy Loading**: Component-level lazy loading for optimal bundle sizes
- **Caching Strategy**: React Query caching with intelligent invalidation
- **Responsive Design**: Mobile-first responsive design with breakpoint optimization
- **Loading States**: Comprehensive loading and error states throughout the application
- **Smooth Animations**: CSS transitions and animations for enhanced user experience
- **Accessibility**: ARIA-compliant components with keyboard navigation support

### Development Workflow
- **Build System**: Vite for fast development and optimized production builds
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Development Server**: Hot module replacement and live reloading
- **Path Aliases**: Clean import statements with @ and @shared aliases
- **Environment Management**: Separate development and production configurations

## External Dependencies

### Database and Hosting
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **WebSocket Support**: Real-time capabilities through Neon's serverless architecture

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library based on Radix UI with Tailwind styling
- **Lucide React**: Modern icon library with consistent styling

### Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for forms and API validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Styling and Theming
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Component variant system for consistent styling
- **clsx**: Utility for constructing className strings conditionally

### Development Tools
- **Vite**: Fast build tool with excellent development experience
- **TypeScript**: Static type checking for improved code quality
- **ESBuild**: Fast JavaScript bundler for production builds

### Fonts and Icons
- **Google Fonts**: Inter (English) and Tajawal (Arabic) for optimal typography
- **Font Awesome**: Comprehensive icon library for UI elements

### Authentication and Security
- **jsonwebtoken**: JWT implementation for secure authentication
- **bcrypt**: Password hashing library for secure credential storage

### Database Integration
- **Drizzle ORM**: Modern TypeScript ORM with excellent developer experience
- **Drizzle Kit**: Database migration and introspection tools
- **pg**: PostgreSQL client library for Node.js