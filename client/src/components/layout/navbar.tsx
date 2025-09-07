import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSound } from "@/hooks/use-sound";
import GlobalSearch from "@/components/search/global-search";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { playClickSound, playHoverSound } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "الرئيسية", path: "/", icon: "fas fa-home" },
    { name: "من نحن", path: "/about", icon: "fas fa-user-friends" },
    { name: "خدماتنا", path: "/services", icon: "fas fa-cogs" },
    { name: "مشاريعنا", path: "/projects", icon: "fas fa-folder-open" },
    { name: "المدونة", path: "/blog", icon: "fas fa-blog" },
    { name: "آراء العملاء", path: "/testimonials", icon: "fas fa-star" },
    { name: "تواصل معنا", path: "/contact", icon: "fas fa-phone" }
  ];

  const isActive = (path: string) => {
    return location === path || (path !== "/" && location.startsWith(path));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" onClick={playClickSound}>
            <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center p-1">
                <img 
                  src="/attached_assets/alqudimi-logo.png" 
                  alt="Alqudimi Technology Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Alqudimi Technology
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Advanced Tech Solutions
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={playClickSound}
                onMouseEnter={playHoverSound}
              >
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-slate-800 ${
                  isActive(item.path) 
                    ? "text-blue-600 bg-blue-50 dark:bg-slate-800" 
                    : "text-slate-700 dark:text-slate-300"
                }`}>
                  <i className={`${item.icon} text-sm`}></i>
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:block">
              <GlobalSearch 
                variant="header" 
                placeholder="ابحث في الموقع..."
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden lg:flex w-10 h-10 p-0"
              onClick={playClickSound}
              data-testid="button-theme-toggle"
            >
              <i className="fas fa-sun dark:hidden"></i>
              <i className="fas fa-moon hidden dark:block"></i>
            </Button>
            
            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Link to="/contact">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  onClick={playClickSound}
                  onMouseEnter={playHoverSound}
                  data-testid="button-nav-cta"
                >
                  <i className="fas fa-rocket ml-2"></i>
                  ابدأ مشروعك
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden w-10 h-10 p-0"
                  onClick={playClickSound}
                  data-testid="button-mobile-menu"
                >
                  <i className="fas fa-bars text-xl"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center p-1">
                        <img 
                          src="/attached_assets/alqudimi-logo.png" 
                          alt="Alqudimi Technology Logo" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                          Alqudimi Technology
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Advanced Tech Solutions
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <div className="flex-1 p-6">
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link 
                          key={item.path} 
                          to={item.path}
                          onClick={() => {
                            playClickSound();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                            isActive(item.path)
                              ? "bg-blue-600 text-white shadow-lg"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}>
                            <i className={`${item.icon} w-5 text-center`}></i>
                            <span className="font-medium">{item.name}</span>
                            {isActive(item.path) && (
                              <i className="fas fa-circle text-xs mr-auto"></i>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Menu Footer */}
                  <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                        onClick={playClickSound}
                        data-testid="button-mobile-cta"
                      >
                        <i className="fas fa-rocket ml-2"></i>
                        ابدأ مشروعك الآن
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}