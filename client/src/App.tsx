import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ui/theme-provider";
import { SoundManager } from "./components/ui/sound-manager";
import LiveChat from "@/components/ui/live-chat";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HomeNew from "@/pages/home-new";
import AboutPage from "@/pages/about-page";
import ServicesPage from "@/pages/services-page";
import ProjectsPage from "@/pages/projects-page";
import ContactPage from "@/pages/contact-page";
import BlogPage from "@/pages/blog-page";
import BlogDetail from "@/pages/blog-detail";
import TestimonialsPage from "@/pages/testimonials-page";
import SearchPage from "@/pages/search-page";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import ProjectDetail from "@/pages/project-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomeNew} />
          <Route path="/about" component={AboutPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:slug" component={BlogDetail} />
          <Route path="/testimonials" component={TestimonialsPage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/projects/:id" component={ProjectDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SoundManager>
            <Toaster />
            <LiveChat />
            <Router />
          </SoundManager>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
