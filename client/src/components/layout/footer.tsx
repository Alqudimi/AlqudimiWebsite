import { useSound } from "@/hooks/use-sound";

export default function Footer() {
  const { playHoverSound } = useSound();

  const quickLinks = [
    { href: "#home", label: "الرئيسية" },
    { href: "#services", label: "الخدمات" },
    { href: "#projects", label: "المشاريع" },
    { href: "#cv", label: "السيرة الذاتية" },
    { href: "#contact", label: "التواصل" },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-code text-primary-foreground text-lg"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">Alqudimi Technology</h3>
                <p className="text-xs text-muted-foreground">تكنولوجيا القديمي</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              نحن نقدم حلول برمجية مبتكرة ومتطورة تساعد الشركات والأفراد على تحقيق أهدافهم التقنية 
              بأعلى معايير الجودة والاحترافية.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/eng_7mi?igsh=MXhib3J4eHI2dnZ0dA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                onMouseEnter={playHoverSound}
                data-testid="social-instagram"
              >
                <i className="fab fa-instagram text-accent-foreground"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                onMouseEnter={playHoverSound}
                data-testid="social-linkedin"
              >
                <i className="fab fa-linkedin text-accent-foreground"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                onMouseEnter={playHoverSound}
                data-testid="social-github"
              >
                <i className="fab fa-github text-accent-foreground"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    onMouseEnter={playHoverSound}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`footer-link-${link.href.slice(1)}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">معلومات الاتصال</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <i className="fas fa-envelope text-primary"></i>
                <span className="text-sm">eng7mi@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-envelope text-primary"></i>
                <span className="text-sm">abodx1234freey@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-phone text-primary"></i>
                <span className="text-sm">+967771442176</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-primary"></i>
                <span className="text-sm">صنعاء، اليمن</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Alqudimi Technology. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
