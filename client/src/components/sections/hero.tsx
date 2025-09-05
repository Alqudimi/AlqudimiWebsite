import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/use-sound";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const { playClickSound, playHoverSound } = useSound();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: "150+", label: "مشروع منجز", icon: "fas fa-rocket" },
    { value: "7+", label: "سنوات خبرة", icon: "fas fa-calendar-alt" },
    { value: "50+", label: "تقنية متقدمة", icon: "fas fa-cogs" },
    { value: "100%", label: "رضا العملاء", icon: "fas fa-heart" },
  ];

  const handleScrollToProjects = () => {
    playClickSound();
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadCV = () => {
    playClickSound();
    // Scroll to CV section
    const cvSection = document.getElementById("cv");
    if (cvSection) {
      cvSection.scrollIntoView({ behavior: "smooth" });
      // After scrolling, trigger the download from CV section
      setTimeout(() => {
        const downloadButton = document.querySelector('[data-testid="button-download-cv"]') as HTMLButtonElement;
        if (downloadButton) {
          downloadButton.click();
        }
      }, 1000);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-8">
      <div className="particle-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        {/* Animated particles would be implemented with Canvas or WebGL */}
      </div>

      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* 3D Logo Placeholder */}
          <div className="w-32 h-32 mx-auto mb-8 floating-animation">
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl flex items-center justify-center">
              <i className="fas fa-laptop-code text-white text-4xl"></i>
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold mb-6">
            <span className="gradient-text text-shadow-lg">Alqudimi Technology</span>
          </h1>

          <p className="text-xl md:text-3xl text-muted-foreground mb-8 leading-relaxed font-light">
            حلول تقنية متطورة ومبتكرة لمستقبل رقمي متقدم
          </p>
          
          <div className="text-lg md:text-xl text-primary/80 mb-8 font-medium">
            Advanced Technology Solutions for a Digital Future
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={handleScrollToProjects}
              onMouseEnter={playHoverSound}
              className="btn-primary"
              data-testid="button-explore-projects"
            >
              <i className="fas fa-rocket ml-2"></i>
              استكشف مشاريعي
            </Button>
            <Button
              onClick={handleDownloadCV}
              onMouseEnter={playHoverSound}
              variant="outline"
              className="btn-secondary"
              data-testid="button-download-cv"
            >
              <i className="fas fa-download ml-2"></i>
              تحميل السيرة الذاتية
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="modern-card p-6 text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
                data-testid={`stat-${index}`}
              >
                <div className="text-3xl mb-3 text-primary group-hover:scale-110 transition-transform duration-300">
                  <i className={stat.icon}></i>
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
