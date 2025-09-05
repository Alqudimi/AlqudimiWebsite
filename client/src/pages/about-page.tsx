import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSound } from "@/hooks/use-sound";

type CVData = {
  id: string;
  type: string;
  title: string;
  company?: string;
  description: string;
  startDate?: string;
  endDate?: string;
  order: number;
  isActive: boolean;
};

export default function AboutPage() {
  const { playClickSound, playHoverSound } = useSound();
  
  const { data: cvData = [], isLoading } = useQuery<CVData[]>({
    queryKey: ["/api/cv"]
  });

  const stats = [
    { value: "150+", label: "مشروع مكتمل", icon: "fas fa-rocket" },
    { value: "7+", label: "سنوات خبرة", icon: "fas fa-calendar" },
    { value: "50+", label: "تقنية متقنة", icon: "fas fa-cogs" },
    { value: "100%", label: "رضا العملاء", icon: "fas fa-heart" }
  ];

  const team = [
    {
      name: "عبدالعزيز محمد القديمي",
      role: "مؤسس ومطور رئيسي",
      image: "/api/placeholder/150/150",
      skills: ["React", "Node.js", "Python", "AI"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">جاري تحميل المعلومات...</p>
        </div>
      </div>
    );
  }

  const summary = cvData.find(item => item.type === 'summary');
  const experience = cvData.filter(item => item.type === 'experience' && item.isActive);
  const education = cvData.filter(item => item.type === 'education' && item.isActive);
  const skills = cvData.filter(item => item.type === 'skill' && item.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 pt-20">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                من نحن
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {summary?.description || "شركة Alqudimi Technology هي شركة تقنية رائدة متخصصة في تطوير الحلول الرقمية المبتكرة"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  onClick={playClickSound}
                  data-testid="button-contact-us"
                >
                  <i className="fas fa-phone ml-2"></i>
                  تواصل معنا
                </Button>
              </Link>
              <Link to="/projects">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
                  onClick={playClickSound}
                  data-testid="button-our-work"
                >
                  <i className="fas fa-folder-open ml-2"></i>
                  أعمالنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-3 text-blue-600">
                  <i className={stat.icon}></i>
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {experience.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white text-center mb-12">
              خبراتنا
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {experience
                .sort((a, b) => a.order - b.order)
                .map((exp, index) => (
                  <Card 
                    key={exp.id}
                    className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                            {exp.title}
                          </h3>
                          {exp.company && (
                            <p className="text-blue-600 font-medium mb-2">{exp.company}</p>
                          )}
                        </div>
                        {(exp.startDate || exp.endDate) && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 md:ml-4">
                            {exp.startDate} - {exp.endDate || 'الحالي'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {exp.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="py-16 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white text-center mb-12">
              مهاراتنا التقنية
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills
                  .sort((a, b) => a.order - b.order)
                  .map((skill, index) => (
                    <div 
                      key={skill.id}
                      className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <h3 className="font-bold text-slate-800 dark:text-white mb-2">
                        {skill.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {skill.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white text-center mb-12">
            فريق العمل
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card 
                  key={index}
                  className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                  onMouseEnter={playHoverSound}
                >
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-user text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {member.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-center space-x-3">
                      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                        <i className="fab fa-linkedin text-blue-600"></i>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                        <i className="fab fa-github text-slate-600"></i>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                        <i className="fab fa-twitter text-blue-400"></i>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            انضم إلى عائلة عملائنا المميزين
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            دعنا نساعدك في تحقيق أهدافك التقنية بخبرتنا ومهاراتنا المتقدمة
          </p>
          <Link to="/contact">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3"
              onClick={playClickSound}
              data-testid="button-join-clients"
            >
              <i className="fas fa-handshake ml-2"></i>
              ابدأ التعاون معنا
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}