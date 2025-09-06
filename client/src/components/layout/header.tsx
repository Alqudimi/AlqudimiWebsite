import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useSound } from "@/hooks/use-sound";
import { Moon, Sun, Volume2, VolumeX, Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound, playHoverSound, playClickSound } = useSound();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    playClickSound();
    setIsMobileMenuOpen(false);
    
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navItems = [
    { href: "#home", label: "الرئيسية" },
    { href: "#services", label: "الخدمات" },
    { href: "#projects", label: "المشاريع" },
    { href: "#cv", label: "السيرة الذاتية" },
    { href: "#contact", label: "التواصل" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "navigation-blur" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center p-1">
                <img 
                  src="/attached_assets/alqudimi-logo.png" 
                  alt="Alqudimi Technology Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">Alqudimi Technology</h1>
                <p className="text-xs text-muted-foreground">تكنولوجيا القديمي</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  onMouseEnter={playHoverSound}
                  className="text-foreground hover:text-primary transition-colors"
                  data-testid={`nav-${item.href.slice(1)}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toggleSound();
                  playHoverSound();
                }}
                onMouseEnter={playHoverSound}
                className="hover:bg-accent"
                data-testid="button-sound-toggle"
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toggleTheme();
                  playClickSound();
                }}
                onMouseEnter={playHoverSound}
                className="hover:bg-accent"
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-accent"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  playClickSound();
                }}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Menu className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="fixed top-16 inset-x-0 bg-card border-b border-border">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-right px-4 py-2 text-lg font-semibold text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                  data-testid={`mobile-nav-${item.href.slice(1)}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
