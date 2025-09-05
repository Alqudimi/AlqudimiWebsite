import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSound } from "@/hooks/use-sound";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
};

export default function ServicesPage() {
  const { playClickSound, playHoverSound } = useSound();
  
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"]
  });

  const features = [
    {
      title: "تصميم مخصص",
      description: "تصاميم فريدة تعكس هوية علامتك التجارية",
      icon: "fas fa-palette"
    },
    {
      title: "تطوير سريع",
      description: "تطوير فعال مع أحدث التقنيات والأدوات",
      icon: "fas fa-bolt"
    },
    {
      title: "دعم مستمر",
      description: "دعم فني متواصل وصيانة دورية",
      icon: "fas fa-headset"
    },
    {
      title: "ضمان الجودة",
      description: "اختبار شامل وضمان جودة عالية",
      icon: "fas fa-shield-alt"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">جاري تحميل الخدمات...</p>
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
                خدماتنا المتميزة
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              نقدم حلول تقنية شاملة ومتطورة لمساعدة أعمالك على النمو والازدهار في العصر الرقمي
            </p>
            <Link to="/contact">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                onClick={playClickSound}
                data-testid="button-get-quote"
              >
                <i className="fas fa-calculator ml-2"></i>
                احصل على عرض سعر
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services
              .filter(service => service.isActive)
              .sort((a, b) => a.order - b.order)
              .map((service, index) => (
                <Card 
                  key={service.id} 
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden"
                  onMouseEnter={playHoverSound}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        style={{ background: `linear-gradient(135deg, var(--${service.color}-500), var(--${service.color}-600))` }}
                      >
                        <i className={`${service.icon} text-white text-2xl`}></i>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        متاح
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <Link to="/contact">
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={playClickSound}
                        data-testid={`button-service-${service.id}`}
                      >
                        اطلب هذه الخدمة
                        <i className="fas fa-arrow-left mr-2"></i>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              لماذا تختار Alqudimi Technology؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نحن نؤمن بتقديم أفضل الخدمات التقنية مع الحرص على رضا عملائنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            مستعد لبدء مشروعك؟
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            تواصل معنا الآن ودعنا نحول أفكارك إلى حقيقة رقمية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3"
                onClick={playClickSound}
                data-testid="button-start-project"
              >
                <i className="fas fa-rocket ml-2"></i>
                ابدأ مشروعك
              </Button>
            </Link>
            <Link to="/projects">
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                onClick={playClickSound}
                data-testid="button-view-portfolio"
              >
                <i className="fas fa-eye ml-2"></i>
                شاهد أعمالنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}