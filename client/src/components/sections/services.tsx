import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useSound } from "@/hooks/use-sound";
import type { Service } from "@shared/schema";

export default function ServicesSection() {
  const [visibleServices, setVisibleServices] = useState<number[]>([]);
  const { playHoverSound } = useSound();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleServices(prev => [...prev, index]);
            }, index * 200);
          }
        });
      },
      { threshold: 0.1 }
    );

    const serviceElements = document.querySelectorAll('.service-card');
    serviceElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [services]);

  const defaultServices = [
    {
      id: "web-dev",
      title: "تطوير المواقع الإلكترونية",
      description: "تطوير مواقع ويب متجاوبة وسريعة باستخدام أحدث التقنيات مثل React، Vue.js، و Django",
      icon: "fas fa-globe",
      color: "blue",
      features: ["مواقع تجارية", "متاجر إلكترونية", "مواقع إدارية"]
    },
    {
      id: "mobile-dev",
      title: "تطوير تطبيقات الموبايل",
      description: "تطبيقات موبايل عالية الأداء لمنصات iOS و Android باستخدام React Native و Flutter",
      icon: "fas fa-mobile-alt",
      color: "green",
      features: ["تطبيقات iOS", "تطبيقات Android", "تطبيقات هجينة"]
    },
    {
      id: "ai-services",
      title: "الذكاء الاصطناعي",
      description: "حلول ذكية متقدمة باستخدام تقنيات Machine Learning و Natural Language Processing",
      icon: "fas fa-brain",
      color: "purple",
      features: ["تعلم الآلة", "معالجة اللغات", "رؤية الحاسوب"]
    },
    {
      id: "database",
      title: "إدارة قواعد البيانات",
      description: "تصميم وإدارة قواعد بيانات قوية وآمنة باستخدام PostgreSQL، MongoDB، و MySQL",
      icon: "fas fa-database",
      color: "orange",
      features: ["تصميم قواعد البيانات", "تحسين الأداء", "أمان البيانات"]
    },
    {
      id: "cloud",
      title: "الحوسبة السحابية",
      description: "نشر وإدارة التطبيقات على الخدمات السحابية مثل AWS، Google Cloud، و Azure",
      icon: "fas fa-cloud",
      color: "cyan",
      features: ["نشر التطبيقات", "إدارة الخوادم", "مراقبة الأداء"]
    },
    {
      id: "security",
      title: "الأمن السيبراني",
      description: "حماية شاملة للتطبيقات والبيانات مع تطبيق أفضل ممارسات الأمان والتشفير",
      icon: "fas fa-shield-alt",
      color: "red",
      features: ["تدقيق الأمان", "حماية البيانات", "اختبار الاختراق"]
    }
  ];

  const servicesToDisplay = services.length > 0 ? services : defaultServices;

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      cyan: "from-cyan-500 to-cyan-600",
      red: "from-red-500 to-red-600",
    };
    return colorMap[color] || "from-blue-500 to-blue-600";
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="service-card animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-lg mb-6"></div>
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-20 bg-muted rounded mb-6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">خدماتنا البرمجية</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نقدم حلول برمجية شاملة تغطي جميع احتياجاتك التقنية بأعلى معايير الجودة والاحترافية
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesToDisplay.map((service, index) => (
            <Card
              key={service.id}
              className={`service-card transition-all duration-500 ${
                visibleServices.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              onMouseEnter={playHoverSound}
              data-testid={`service-${service.id}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(service.color)} rounded-lg flex items-center justify-center mb-6`}>
                <i className={`${service.icon} text-white text-2xl`}></i>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2 text-sm">
                {(service.features || []).map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <i className="fas fa-check text-green-500 ml-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
