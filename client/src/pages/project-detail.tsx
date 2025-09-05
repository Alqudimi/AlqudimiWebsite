import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSound } from "@/hooks/use-sound";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { playClickSound, playHoverSound } = useSound();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error("Project not found");
      return response.json();
    },
  });

  const handleBackToProjects = () => {
    playClickSound();
    setLocation("/#projects");
    // Scroll to projects section after navigation
    setTimeout(() => {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleExternalLink = (url: string | null | undefined) => {
    if (!url || url === "#") return;
    playClickSound();
    window.open(url, "_blank", "noopener noreferrer");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-5/6"></div>
                <div className="h-6 bg-muted rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="p-12">
              <i className="fas fa-exclamation-triangle text-6xl text-muted-foreground mb-6"></i>
              <h1 className="text-3xl font-bold mb-4">المشروع غير موجود</h1>
              <p className="text-muted-foreground mb-8">
                عذراً، المشروع الذي تبحث عنه غير متوفر أو تم حذفه.
              </p>
              <Button onClick={handleBackToProjects} className="btn-primary">
                <i className="fas fa-arrow-right ml-2"></i>
                العودة إلى المشاريع
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={handleBackToProjects}
            onMouseEnter={playHoverSound}
            className="mb-8"
            data-testid="button-back-to-projects"
          >
            <i className="fas fa-arrow-right ml-2"></i>
            العودة إلى المشاريع
          </Button>

          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies?.map((tech) => (
                <Badge key={tech} variant="secondary" className="px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex gap-4">
              {project.liveUrl && project.liveUrl !== "#" && (
                <Button
                  onClick={() => handleExternalLink(project.liveUrl)}
                  onMouseEnter={playHoverSound}
                  className="btn-primary"
                  data-testid="button-view-live"
                >
                  <i className="fas fa-external-link-alt ml-2"></i>
                  عرض المشروع المباشر
                </Button>
              )}
              {project.githubUrl && project.githubUrl !== "#" && (
                <Button
                  onClick={() => handleExternalLink(project.githubUrl)}
                  onMouseEnter={playHoverSound}
                  variant="outline"
                  data-testid="button-view-github"
                >
                  <i className="fab fa-github ml-2"></i>
                  عرض الكود المصدري
                </Button>
              )}
            </div>
          </div>

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <div className="grid gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={image}
                      alt={`${project.title} - صورة ${index + 1}`}
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                      data-testid={`project-image-${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Description */}
          <Card className="p-8 mb-8 glass-card">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-info-circle text-primary ml-3"></i>
              وصف المشروع
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {project.description?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>

          {/* Project Details */}
          <Card className="p-8 glass-card">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-cog text-primary ml-3"></i>
              تفاصيل تقنية
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">التقنيات المستخدمة</h3>
                <div className="space-y-2">
                  {project.technologies?.map((tech, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <i className="fas fa-check text-green-500"></i>
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">معلومات إضافية</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-tag text-primary"></i>
                    <span>الفئة: {project.category}</span>
                  </div>
                  {project.isFeatured && (
                    <div className="flex items-center gap-2">
                      <i className="fas fa-star text-yellow-500"></i>
                      <span>مشروع مميز</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <i className="fas fa-calendar text-primary"></i>
                    <span>تاريخ الإنشاء: {new Date(project.createdAt).toLocaleDateString('ar')}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">هل لديك مشروع مشابه؟</h3>
            <p className="text-muted-foreground mb-6">
              تواصل معنا لنناقش كيف يمكننا مساعدتك في تطوير مشروعك القادم
            </p>
            <Button
              onClick={() => {
                playClickSound();
                setLocation("/#contact");
                setTimeout(() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              }}
              onMouseEnter={playHoverSound}
              className="btn-primary"
              data-testid="button-contact-us"
            >
              <i className="fas fa-envelope ml-2"></i>
              تواصل معنا
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
