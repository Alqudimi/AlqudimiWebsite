import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero";
import ServicesSection from "@/components/sections/services";
import ProjectsSection from "@/components/sections/projects";
import CVSection from "@/components/sections/cv";
import ContactSection from "@/components/sections/contact";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Scroll reveal animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      scrollRevealElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <CVSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
