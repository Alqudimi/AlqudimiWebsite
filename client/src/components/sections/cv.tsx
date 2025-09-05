import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSound } from "@/hooks/use-sound";
import type { CvData } from "@shared/schema";

export default function CVSection() {
  const { playClickSound, playHoverSound } = useSound();

  const { data: cvData = [], isLoading } = useQuery<CvData[]>({
    queryKey: ["/api/cv"],
  });

  const getCvDataByType = (type: string) => {
    return cvData.filter(item => item.type === type && item.isActive);
  };

  const handleDownloadCV = async () => {
    playClickSound();
    try {
      // Generate CV data for download
      const cvContent = generateCVContent();
      
      // Create and download as text file for now (can be enhanced to PDF later)
      const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'عبدالعزيز_محمد_القديمي_CV.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      console.log("CV downloaded successfully");
    } catch (error) {
      console.error('Error downloading CV:', error);
    }
  };

  const generateCVContent = () => {
    const summaryData = getCvDataByType('summary').length > 0 ? getCvDataByType('summary') : mockCvData.summary;
    const skillsData = getCvDataByType('skill').length > 0 ? getCvDataByType('skill') : mockCvData.skills;
    const educationData = getCvDataByType('education').length > 0 ? getCvDataByType('education') : mockCvData.education;
    const experienceData = getCvDataByType('experience').length > 0 ? getCvDataByType('experience') : mockCvData.experience;
    const certificationsData = getCvDataByType('certification').length > 0 ? getCvDataByType('certification') : mockCvData.certifications;

    let content = `
==============================================
عبدالعزيز محمد القديمي - السيرة الذاتية
Abdulaziz Mohammed Alqudimi - Resume
==============================================

`;
    
    // Summary
    content += `الملخص المهني / Professional Summary:
`;
    content += `${summaryData[0]?.description || summaryData[0]?.title}\n\n`;
    
    // Skills
    content += `المهارات / Skills:\n`;
    skillsData.forEach(skill => {
      const stars = '★'.repeat(skill.level || 5);
      content += `• ${skill.title}: ${stars}\n`;
    });
    content += `\n`;
    
    // Experience
    content += `الخبرة العملية / Work Experience:\n`;
    experienceData.forEach(exp => {
      content += `• ${exp.title} - ${exp.subtitle || ''} (${exp.startDate || ''} - ${exp.endDate || ''})\n`;
      if ('description' in exp && exp.description) content += `  ${exp.description}\n`;
    });
    content += `\n`;
    
    // Education
    content += `التعليم / Education:\n`;
    educationData.forEach(edu => {
      content += `• ${edu.title} - ${edu.subtitle} (${edu.startDate} - ${edu.endDate})\n`;
    });
    content += `\n`;
    
    // Certifications
    content += `الشهادات والجوائز / Certifications & Awards:\n`;
    certificationsData.forEach(cert => {
      content += `• ${cert.title} - ${cert.subtitle}\n`;
    });
    
    content += `\n==============================================\nتم إنشاء هذه السيرة الذاتية من موقع Alqudimi Technology\nGenerated from Alqudimi Technology Website\n==============================================`;
    
    return content;
  };

  // Mock data structure for when no CV data is loaded
  const mockCvData = {
    summary: [{
      title: "الملخص المهني",
      description: `مطور برمجيات محترف مع أكثر من 5 سنوات من الخبرة في تطوير تطبيقات الويب والموبايل والذكاء الاصطناعي. 
      متخصص في استخدام التقنيات الحديثة مثل Python، JavaScript، React، Django، وتقنيات الذكاء الاصطناعي. 
      شغوف بحل المشاكل التقنية المعقدة وتقديم حلول مبتكرة تلبي احتياجات العملاء.`
    }],
    skills: [
      { title: "Python", level: 5 },
      { title: "JavaScript", level: 4 },
      { title: "Java", level: 4 },
      { title: "Django/Flask", level: 5 },
      { title: "React/Vue.js", level: 4 },
      { title: "TensorFlow/PyTorch", level: 4 },
    ],
    education: [{
      title: "بكالوريوس علوم الحاسوب",
      subtitle: "جامعة صنعاء",
      startDate: "2018",
      endDate: "2022"
    }, {
      title: "دبلوم البرمجة المتقدمة",
      subtitle: "معهد التقنيات المتقدمة",
      startDate: "2017",
      endDate: "2018"
    }],
    experience: [{
      title: "مطور برمجيات كبير",
      subtitle: "مطور مستقل",
      startDate: "2020",
      endDate: "الآن"
    }, {
      title: "مطور تطبيقات الويب",
      subtitle: "شركة التقنيات الذكية",
      startDate: "2019",
      endDate: "2020"
    }],
    certifications: [{
      title: "شهادة AWS Solutions Architect",
      subtitle: "Amazon Web Services - 2023",
      icon: "fas fa-award"
    }, {
      title: "جائزة أفضل مطور شاب",
      subtitle: "مؤتمر التقنية - 2022",
      icon: "fas fa-trophy"
    }]
  };

  const summary = getCvDataByType('summary').length > 0 ? getCvDataByType('summary') : mockCvData.summary;
  const skills = getCvDataByType('skill').length > 0 ? getCvDataByType('skill') : mockCvData.skills;
  const education = getCvDataByType('education').length > 0 ? getCvDataByType('education') : mockCvData.education;
  const experience = getCvDataByType('experience').length > 0 ? getCvDataByType('experience') : mockCvData.experience;
  const certifications = getCvDataByType('certification').length > 0 ? getCvDataByType('certification') : mockCvData.certifications;

  const renderSkillBar = (skill: any) => (
    <div key={skill.title || skill.id} className="flex items-center justify-between">
      <span>{skill.title}</span>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-2 rounded ${
              i < (skill.level || 0) ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="cv-section animate-pulse">
                <div className="h-8 bg-muted rounded mb-6 w-48"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cv" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">السيرة الذاتية</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            تعرف على خلفيتي المهنية ومهاراتي التقنية وخبراتي في مجال تطوير البرمجيات
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Professional Summary */}
          <Card className="cv-section mb-8 scroll-reveal" data-testid="cv-summary">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-user-tie text-primary ml-3"></i>
              الملخص المهني
            </h3>
            {summary.map((item, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            ))}
          </Card>

          {/* Skills Section */}
          <Card className="cv-section mb-8 scroll-reveal" data-testid="cv-skills">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-code text-primary ml-3"></i>
              المهارات التقنية
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">لغات البرمجة</h4>
                <div className="space-y-3">
                  {skills.slice(0, 3).map(renderSkillBar)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">الأطر والمكتبات</h4>
                <div className="space-y-3">
                  {skills.slice(3, 6).map(renderSkillBar)}
                </div>
              </div>
            </div>
          </Card>

          {/* Education & Experience */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Education */}
            <Card className="cv-section scroll-reveal" data-testid="cv-education">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <i className="fas fa-graduation-cap text-primary ml-3"></i>
                التعليم
              </h3>
              <div className="space-y-6">
                {education.map((item, index) => (
                  <div key={index} className="border-r-4 border-primary pr-4">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground">{item.subtitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.startDate} - {item.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Experience */}
            <Card className="cv-section scroll-reveal" data-testid="cv-experience">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <i className="fas fa-briefcase text-primary ml-3"></i>
                الخبرة المهنية
              </h3>
              <div className="space-y-6">
                {experience.map((item, index) => (
                  <div key={index} className={`border-r-4 pr-4 ${index === 0 ? 'border-primary' : 'border-secondary'}`}>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground">{item.subtitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.startDate} - {item.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Certifications */}
          <Card className="cv-section mt-8 scroll-reveal" data-testid="cv-certifications">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-certificate text-primary ml-3"></i>
              الشهادات والجوائز
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-4" onMouseEnter={playHoverSound}>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className={`${cert.icon || 'fas fa-award'} text-primary`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground">{cert.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Download CV Button */}
          <div className="text-center mt-12 scroll-reveal">
            <Button
              onClick={handleDownloadCV}
              onMouseEnter={playHoverSound}
              className="btn-primary"
              data-testid="button-download-cv-main"
            >
              <i className="fas fa-download ml-2"></i>
              تحميل السيرة الذاتية PDF
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
