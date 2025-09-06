import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useSound } from "@/hooks/use-sound";
import { Moon, Sun, Volume2, VolumeX, Menu, X } from "lucide-react";
// Logo will be handled directly in the component

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
            <div className="flex items-center space-x-4 rtl:space-x-reverse z-50">
              <div className="relative group cursor-pointer">
                {/* Glow Effect Background */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
                
                {/* Main Logo Container */}
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:shadow-cyan-500/50 group-hover:scale-110 group-hover:rotate-6 border border-white/20">
                  {/* Logo Text */}
                  <div className="relative z-10">
                    <span className="text-white font-black text-2xl tracking-tighter drop-shadow-lg transform transition-all duration-300 group-hover:scale-125">
                      AT
                    </span>
                    {/* Shadow Effect */}
                    <div className="absolute inset-0 text-white/20 font-black text-2xl tracking-tighter transform translate-x-1 translate-y-1 -z-10">
                      AT
                    </div>
                  </div>
                  
                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-xl"></div>
                </div>
                
                {/* Hover Glow */}
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-md"></div>
              </div>
              
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent hover:from-cyan-500 hover:to-blue-600 transition-all duration-500 drop-shadow-sm">
                  Alqudimi Technology
                </h1>
                <p className="text-sm text-muted-foreground/90 font-semibold tracking-wider">
                  تكنولوجيا القديمي
                </p>
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
