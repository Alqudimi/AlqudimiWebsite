import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Quote, Building, User, Filter } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  clientNameEn: string;
  clientTitle: string;
  clientTitleEn: string;
  clientCompany: string;
  clientCompanyEn: string;
  testimonial: string;
  testimonialEn: string;
  rating: number;
  clientImage: string;
  projectId: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  titleEn: string;
  category: string;
}

export default function TestimonialsPage() {
  const [isArabic, setIsArabic] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  const { data: featuredTestimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials', { featured: true }],
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesProject = selectedProject === "all" || testimonial.projectId === selectedProject;
    const matchesRating = ratingFilter === "all" || testimonial.rating === parseInt(ratingFilter);
    return matchesProject && matchesRating;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            {isArabic ? "آراء العملاء" : "Client Testimonials"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic 
              ? "اطلع على تجارب عملائنا الناجحة وآرائهم في خدماتنا"
              : "Discover what our clients say about their successful experiences with our services"
            }
          </p>
        </div>

        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              {isArabic ? "التقييمات المميزة" : "Featured Reviews"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredTestimonials.slice(0, 2).map((testimonial) => (
                <Card key={testimonial.id} className="relative overflow-hidden border-primary/20">
                  <div className="absolute top-4 right-4">
                    <Quote className="h-8 w-8 text-primary/20" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage 
                          src={testimonial.clientImage} 
                          alt={isArabic ? testimonial.clientName : testimonial.clientNameEn || testimonial.clientName} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {getInitials(isArabic ? testimonial.clientName : testimonial.clientNameEn || testimonial.clientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {isArabic ? testimonial.clientName : testimonial.clientNameEn || testimonial.clientName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? testimonial.clientTitle : testimonial.clientTitleEn || testimonial.clientTitle}
                        </p>
                        {testimonial.clientCompany && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {isArabic ? testimonial.clientCompany : testimonial.clientCompanyEn || testimonial.clientCompany}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {isArabic ? "مميز" : "Featured"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">{renderStars(testimonial.rating)}</div>
                      <span className="text-sm font-medium">({testimonial.rating}/5)</span>
                    </div>

                    <blockquote className="text-muted-foreground leading-relaxed">
                      "{isArabic ? testimonial.testimonial : testimonial.testimonialEn || testimonial.testimonial}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {isArabic ? "تصفية حسب:" : "Filter by:"}
            </span>
          </div>
          
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-project-filter">
              <SelectValue placeholder={isArabic ? "اختر المشروع" : "Select project"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? "جميع المشاريع" : "All projects"}</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {isArabic ? project.title : project.titleEn || project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full md:w-32" data-testid="select-rating-filter">
              <SelectValue placeholder={isArabic ? "التقييم" : "Rating"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? "جميع التقييمات" : "All ratings"}</SelectItem>
              <SelectItem value="5">5 ⭐</SelectItem>
              <SelectItem value="4">4 ⭐</SelectItem>
              <SelectItem value="3">3 ⭐</SelectItem>
              <SelectItem value="2">2 ⭐</SelectItem>
              <SelectItem value="1">1 ⭐</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setIsArabic(!isArabic)}
            data-testid="button-toggle-language"
          >
            {isArabic ? "English" : "العربية"}
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={testimonial.clientImage} 
                      alt={isArabic ? testimonial.clientName : testimonial.clientNameEn || testimonial.clientName} 
                    />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {getInitials(isArabic ? testimonial.clientName : testimonial.clientNameEn || testimonial.clientName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {isArabic ? testimonial.clientName : testimonial.clientNameEn || testimonial.clientName}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {isArabic ? testimonial.clientTitle : testimonial.clientTitleEn || testimonial.clientTitle}
                    </p>
                    {testimonial.clientCompany && (
                      <div className="flex items-center gap-1 mt-1">
                        <Building className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {isArabic ? testimonial.clientCompany : testimonial.clientCompanyEn || testimonial.clientCompany}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                  <span className="text-sm font-medium">({testimonial.rating}/5)</span>
                </div>

                <blockquote className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                  "{isArabic ? testimonial.testimonial : testimonial.testimonialEn || testimonial.testimonial}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredTestimonials.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isArabic ? "لا توجد تقييمات" : "No testimonials found"}
            </h3>
            <p className="text-muted-foreground">
              {isArabic 
                ? "جرب تغيير معايير التصفية"
                : "Try changing your filter criteria"
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 py-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            {isArabic ? "جاهز لتكون العميل التالي؟" : "Ready to be our next client?"}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isArabic 
              ? "انضم إلى قائمة عملائنا الراضين واحصل على خدمات تقنية متميزة"
              : "Join our list of satisfied clients and get exceptional technical services"
            }
          </p>
          <Button size="lg" data-testid="button-contact-cta">
            {isArabic ? "تواصل معنا الآن" : "Contact Us Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}