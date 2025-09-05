import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  FileText, 
  Folder, 
  User, 
  Star, 
  Hash,
  Calendar,
  ArrowRight,
  Filter,
  SortAsc
} from "lucide-react";
import { Link, useLocation } from "wouter";
import GlobalSearch from "@/components/search/global-search";

interface SearchResult {
  type: "blog" | "project" | "service" | "testimonial";
  id: string;
  title: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  url: string;
  category?: string;
  categoryEn?: string;
  tags?: string[];
  tagsEn?: string[];
  publishedAt?: string;
  rating?: number;
  clientName?: string;
  clientNameEn?: string;
}

export default function SearchPage() {
  const [location] = useLocation();
  const [isArabic, setIsArabic] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Get search query from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  // Update URL when query changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeTab !== "all") params.set("type", activeTab);
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [query, activeTab]);

  const { data: results = [], isLoading } = useQuery<SearchResult[]>({
    queryKey: ['/api/search', query, activeTab, sortBy, categoryFilter],
    enabled: query.length >= 2,
  });

  // Get unique categories from results
  const categories = Array.from(new Set(
    results.map(result => isArabic ? result.category : result.categoryEn || result.category)
      .filter(Boolean)
  ));

  // Filter and sort results
  const filteredResults = results
    .filter(result => {
      if (activeTab !== "all" && result.type !== activeTab) return false;
      if (categoryFilter !== "all") {
        const category = isArabic ? result.category : result.categoryEn || result.category;
        return category === categoryFilter;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime();
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "title":
          const titleA = isArabic ? a.title : a.titleEn || a.title;
          const titleB = isArabic ? b.title : b.titleEn || b.title;
          return titleA.localeCompare(titleB);
        default:
          return 0; // Keep original order (relevance)
      }
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'project':
        return <Folder className="h-4 w-4" />;
      case 'service':
        return <Hash className="h-4 w-4" />;
      case 'testimonial':
        return <Star className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      blog: isArabic ? "مقالات" : "Articles",
      project: isArabic ? "مشاريع" : "Projects", 
      service: isArabic ? "خدمات" : "Services",
      testimonial: isArabic ? "تقييمات" : "Reviews",
      all: isArabic ? "الكل" : "All"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const resultCounts = {
    all: results.length,
    blog: results.filter(r => r.type === 'blog').length,
    project: results.filter(r => r.type === 'project').length,
    service: results.filter(r => r.type === 'service').length,
    testimonial: results.filter(r => r.type === 'testimonial').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isArabic ? "البحث في الموقع" : "Site Search"}
          </h1>
          <div className="max-w-2xl mx-auto">
            <GlobalSearch 
              variant="full" 
              placeholder={isArabic ? "ابحث في المحتوى..." : "Search content..."}
            />
          </div>
        </div>

        {query.length >= 2 && (
          <>
            {/* Search Info */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {isArabic ? "نتائج البحث عن:" : "Search results for:"} "{query}"
                </h2>
                <p className="text-muted-foreground">
                  {filteredResults.length} {isArabic ? "نتيجة" : "results"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsArabic(!isArabic)}
                data-testid="button-toggle-language"
              >
                {isArabic ? "English" : "العربية"}
              </Button>
            </div>

            {/* Filters and Tabs */}
            <div className="mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid grid-cols-5 w-full max-w-lg">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">{getTypeLabel("all")}</span>
                    {resultCounts.all > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {resultCounts.all}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="blog" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">{getTypeLabel("blog")}</span>
                    {resultCounts.blog > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {resultCounts.blog}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="project" className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span className="hidden sm:inline">{getTypeLabel("project")}</span>
                    {resultCounts.project > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {resultCounts.project}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="service" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="hidden sm:inline">{getTypeLabel("service")}</span>
                    {resultCounts.service > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {resultCounts.service}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="testimonial" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span className="hidden sm:inline">{getTypeLabel("testimonial")}</span>
                    {resultCounts.testimonial > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {resultCounts.testimonial}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Advanced Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {isArabic ? "تصفية:" : "Filter:"}
                  </span>
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48" data-testid="select-category-filter">
                    <SelectValue placeholder={isArabic ? "التصنيف" : "Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isArabic ? "جميع التصنيفات" : "All categories"}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category || ""}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {isArabic ? "ترتيب:" : "Sort:"}
                  </span>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40" data-testid="select-sort-by">
                    <SelectValue placeholder={isArabic ? "الترتيب" : "Sort by"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">{isArabic ? "الصلة" : "Relevance"}</SelectItem>
                    <SelectItem value="date">{isArabic ? "التاريخ" : "Date"}</SelectItem>
                    <SelectItem value="title">{isArabic ? "العنوان" : "Title"}</SelectItem>
                    <SelectItem value="rating">{isArabic ? "التقييم" : "Rating"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {isArabic ? "لا توجد نتائج" : "No results found"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {isArabic 
                      ? "جرب تغيير كلمات البحث أو الفلاتر"
                      : "Try changing your search terms or filters"
                    }
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      setActiveTab("all");
                      setCategoryFilter("all");
                      setSortBy("relevance");
                    }}
                    data-testid="button-clear-search"
                  >
                    {isArabic ? "مسح البحث" : "Clear search"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredResults.map((result) => (
                    <Card key={result.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="text-primary">
                                {getTypeIcon(result.type)}
                              </div>
                              <Badge variant="outline">
                                {getTypeLabel(result.type)}
                              </Badge>
                              {result.category && (
                                <Badge variant="secondary">
                                  {isArabic ? result.category : result.categoryEn || result.category}
                                </Badge>
                              )}
                              {result.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{result.rating}</span>
                                </div>
                              )}
                            </div>

                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                              <Link href={result.url}>
                                {isArabic ? result.title : result.titleEn || result.title}
                              </Link>
                            </h3>

                            {result.excerpt && (
                              <p className="text-muted-foreground mb-4 line-clamp-2">
                                {isArabic ? result.excerpt : result.excerptEn || result.excerpt}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {result.publishedAt && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(result.publishedAt)}
                                </span>
                              )}
                              {result.clientName && (
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {isArabic ? result.clientName : result.clientNameEn || result.clientName}
                                </span>
                              )}
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Hash className="h-4 w-4" />
                                  <span>{(isArabic ? result.tags : result.tagsEn || result.tags).slice(0, 2).join(", ")}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Link href={result.url}>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-4 flex-shrink-0" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* No query state */}
        {query.length < 2 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-4">
              {isArabic ? "ابحث في محتوى الموقع" : "Search site content"}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {isArabic 
                ? "ابحث في المقالات والمشاريع والخدمات والتقييمات للعثور على ما تحتاجه"
                : "Search through articles, projects, services, and reviews to find what you need"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}