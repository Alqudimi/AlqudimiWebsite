import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSound } from "@/hooks/use-sound";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  order: number;
  isActive: boolean;
};

export default function ProjectsPage() {
  const { playClickSound, playHoverSound } = useSound();
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  const categories = [
    { name: "الكل", value: "all", icon: "fas fa-th" },
    { name: "مواقع الويب", value: "web", icon: "fas fa-globe" },
    { name: "تطبيقات الموبايل", value: "mobile", icon: "fas fa-mobile-alt" },
    { name: "الذكاء الاصطناعي", value: "ai", icon: "fas fa-brain" },
    { name: "التجارة الإلكترونية", value: "ecommerce", icon: "fas fa-shopping-cart" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">جاري تحميل المشاريع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 pt-20">
      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مشاريعنا المميزة
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              استكشف مجموعة من أفضل مشاريعنا التي نفذناها بأحدث التقنيات والأدوات
            </p>
            <Link to="/contact">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                onClick={playClickSound}
                data-testid="button-start-project"
              >
                <i className="fas fa-plus ml-2"></i>
                ابدأ مشروعك الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button
                key={category.value}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2"
                onClick={playClickSound}
                data-testid={`button-category-${category.value}`}
              >
                <i className={`${category.icon} ml-2`}></i>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {projects.filter(project => project.isActive).length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-folder-open text-slate-400 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                لا توجد مشاريع متاحة حالياً
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                نعمل على إضافة مشاريع جديدة قريباً
              </p>
              <Link to="/contact">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={playClickSound}
                  data-testid="button-contact-projects"
                >
                  تواصل معنا لمناقشة مشروعك
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects
                .filter(project => project.isActive)
                .sort((a, b) => a.order - b.order)
                .map((project, index) => (
                  <Card 
                    key={project.id}
                    className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden"
                    onMouseEnter={playHoverSound}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Project Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600">
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fas fa-laptop-code text-blue-600 text-4xl"></i>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies?.length > 3 && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Link to={`/projects/${project.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                            onClick={playClickSound}
                            data-testid={`button-view-project-${project.id}`}
                          >
                            <i className="fas fa-eye ml-2"></i>
                            عرض التفاصيل
                          </Button>
                        </Link>
                        {project.liveUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="w-10 h-10 p-0 text-green-600 hover:bg-green-50"
                            onClick={(e) => {
                              e.preventDefault();
                              playClickSound();
                              window.open(project.liveUrl, '_blank');
                            }}
                            data-testid={`button-live-${project.id}`}
                          >
                            <i className="fas fa-external-link-alt"></i>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="w-10 h-10 p-0 text-slate-600 hover:bg-slate-50"
                            onClick={(e) => {
                              e.preventDefault();
                              playClickSound();
                              window.open(project.githubUrl, '_blank');
                            }}
                            data-testid={`button-github-${project.id}`}
                          >
                            <i className="fab fa-github"></i>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            أعجبك ما رأيت؟
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            دعنا نصنع مشروعاً مميزاً لك بنفس مستوى الجودة والإبداع
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3"
                onClick={playClickSound}
                data-testid="button-discuss-project"
              >
                <i className="fas fa-comments ml-2"></i>
                ناقش مشروعك معنا
              </Button>
            </Link>
            <Link to="/services">
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                onClick={playClickSound}
                data-testid="button-see-services"
              >
                <i className="fas fa-cogs ml-2"></i>
                شاهد خدماتنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}