import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSound } from "@/hooks/use-sound";
import type { Project } from "@shared/schema";

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { playClickSound, playHoverSound } = useSound();
  const [, setLocation] = useLocation();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const categories = [
    { id: "all", label: "جميع المشاريع" },
    { id: "web", label: "مواقع الويب" },
    { id: "mobile", label: "تطبيقات الموبايل" },
    { id: "ai", label: "الذكاء الاصطناعي" },
    { id: "desktop", label: "تطبيقات سطح المكتب" },
  ];

  const filteredProjects = projects.filter(project => 
    activeFilter === "all" || project.category === activeFilter
  );

  const handleFilterClick = (categoryId: string) => {
    setActiveFilter(categoryId);
    playClickSound();
  };

  const handleProjectClick = (projectId: string) => {
    playClickSound();
    setLocation(`/projects/${projectId}`);
  };

  const handleViewMore = () => {
    playClickSound();
    // Scroll to top of projects section for better UX
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
    // Show a message that more projects will be added
    console.log("More projects coming soon!");
  };

  // Mock data for when no projects are loaded from API
  const mockProjects = [
    {
      id: "ecommerce-platform",
      title: "منصة التجارة الإلكترونية",
      shortDescription: "متجر إلكتروني متكامل مع نظام دفع آمن وإدارة المخزون وتحليلات المبيعات",
      technologies: ["Django", "React", "PostgreSQL"],
      images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      category: "web",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: "ai-chatbot",
      title: "مساعد ذكي بالذكاء الاصطناعي",
      shortDescription: "روبوت محادثة ذكي يتفهم اللغة الطبيعية ويقدم إجابات دقيقة ومفيدة",
      technologies: ["Python", "NLP", "TensorFlow"],
      images: ["https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      category: "ai",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: "task-manager-app",
      title: "تطبيق إدارة المهام",
      shortDescription: "تطبيق موبايل لإدارة المهام والمشاريع مع ميزات التعاون الجماعي والتزامن",
      technologies: ["React Native", "Firebase", "Redux"],
      images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      category: "mobile",
      liveUrl: "#",
      githubUrl: "#",
    },
  ];

  const projectsToDisplay = projects.length > 0 ? filteredProjects : mockProjects.filter(p => 
    activeFilter === "all" || p.category === activeFilter
  );

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-muted"></div>
                <div className="p-6">
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-muted rounded-full"></div>
                    <div className="h-6 w-16 bg-muted rounded-full"></div>
                  </div>
                  <div className="h-6 bg-muted rounded mb-3"></div>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-4 w-4 bg-muted rounded"></div>
                      <div className="h-4 w-4 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">معرض المشاريع</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            استعرض مجموعة من أفضل المشاريع التي تم تطويرها بأحدث التقنيات ووفقاً لأعلى معايير الجودة
          </p>
        </div>

        {/* Project Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 scroll-reveal">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleFilterClick(category.id)}
              onMouseEnter={playHoverSound}
              variant={activeFilter === category.id ? "default" : "outline"}
              className="px-6 py-3 font-semibold transition-all hover:scale-105"
              data-testid={`filter-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsToDisplay.map((project, index) => (
            <Card
              key={project.id}
              className="project-card overflow-hidden hover-lift scroll-reveal glass-card"
              onClick={() => handleProjectClick(project.id)}
              onMouseEnter={playHoverSound}
              data-testid={`project-${project.id}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {project.images && project.images.length > 0 && (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                
                <p className="text-muted-foreground mb-4">
                  {project.shortDescription || project.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-primary hover:underline cursor-pointer">
                    عرض التفاصيل
                  </span>
                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <i className="fas fa-external-link-alt text-muted-foreground hover:text-primary cursor-pointer"></i>
                    )}
                    {project.githubUrl && (
                      <i className="fab fa-github text-muted-foreground hover:text-primary cursor-pointer"></i>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {projectsToDisplay.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              لا توجد مشاريع في هذه الفئة حالياً
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            onClick={handleViewMore}
            onMouseEnter={playHoverSound}
            className="btn-primary"
            data-testid="button-view-more-projects"
          >
            عرض المزيد من المشاريع
          </Button>
        </div>
      </div>
    </section>
  );
}
