import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSound } from "@/hooks/use-sound";

export default function HomeNew() {
  const { playClickSound, playHoverSound } = useSound();

  const services = [
    {
      id: 1,
      title: "تطوير المواقع",
      description: "مواقع احترافية وسريعة",
      icon: "fas fa-globe",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "تطبيقات الموبايل",
      description: "تطبيقات ذكية لجميع الأجهزة",
      icon: "fas fa-mobile-alt",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "الذكاء الاصطناعي",
      description: "حلول ذكية متطورة",
      icon: "fas fa-brain",
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "التجارة الإلكترونية",
      description: "متاجر إلكترونية شاملة",
      icon: "fas fa-shopping-cart",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8 text-center lg:text-right">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Alqudimi Technology
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
                  نحن نقدم حلول تقنية متطورة ومبتكرة لجعل أعمالك تنمو وتزدهر في العصر الرقمي
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/services">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    onClick={playClickSound}
                    onMouseEnter={playHoverSound}
                    data-testid="button-services"
                  >
                    <i className="fas fa-rocket ml-2"></i>
                    خدماتنا
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
                    onClick={playClickSound}
                    onMouseEnter={playHoverSound}
                    data-testid="button-about"
                  >
                    <i className="fas fa-info-circle ml-2"></i>
                    من نحن
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-1">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-laptop-code text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                      تقنيات متقدمة
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      نستخدم أحدث التقنيات لضمان أفضل النتائج
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">150+</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">مشروع</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">7+</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">سنوات خبرة</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              خدماتنا المتميزة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الخدمات التقنية لتلبية جميع احتياجاتك
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${service.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button 
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={playClickSound}
                data-testid="button-all-services"
              >
                جميع الخدمات
                <i className="fas fa-arrow-left mr-2"></i>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            هل أنت مستعد لبدء مشروعك؟
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            تواصل معنا اليوم ودعنا نساعدك في تحقيق أهدافك التقنية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3"
                onClick={playClickSound}
                data-testid="button-contact"
              >
                <i className="fas fa-phone ml-2"></i>
                تواصل معنا
              </Button>
            </Link>
            <Link to="/projects">
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                onClick={playClickSound}
                data-testid="button-projects"
              >
                <i className="fas fa-folder-open ml-2"></i>
                مشاريعنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}