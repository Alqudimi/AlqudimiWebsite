import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  FileText, 
  Folder, 
  User, 
  Star, 
  Loader2,
  ArrowRight,
  Hash,
  Calendar
} from "lucide-react";
import { Link } from "wouter";

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

interface GlobalSearchProps {
  variant?: "full" | "compact" | "header";
  placeholder?: string;
  onResultClick?: () => void;
}

export default function GlobalSearch({ 
  variant = "full", 
  placeholder,
  onResultClick 
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search API call
  const { data: results = [], isLoading } = useQuery<SearchResult[]>({
    queryKey: ['/api/search', query],
    enabled: query.length >= 2,
  });

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    onResultClick?.();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
      blog: isArabic ? "مقال" : "Article",
      project: isArabic ? "مشروع" : "Project", 
      service: isArabic ? "خدمة" : "Service",
      testimonial: isArabic ? "تقييم" : "Review"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  if (variant === "compact") {
    return (
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            placeholder={placeholder || (isArabic ? "ابحث..." : "Search...")}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10"
            data-testid="input-global-search"
          />
        </div>

        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-lg">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">{isArabic ? "جارٍ البحث..." : "Searching..."}</span>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  {query.length < 2 
                    ? (isArabic ? "اكتب حرفين على الأقل للبحث" : "Type at least 2 characters to search")
                    : (isArabic ? "لا توجد نتائج" : "No results found")
                  }
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {Object.entries(groupedResults).map(([type, typeResults]) => (
                    <div key={type}>
                      <div className="px-4 py-2 bg-muted text-sm font-medium flex items-center gap-2">
                        {getTypeIcon(type)}
                        {getTypeLabel(type)} ({typeResults.length})
                      </div>
                      {typeResults.slice(0, 3).map((result) => (
                        <Link key={result.id} href={result.url} onClick={handleResultClick}>
                          <div className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">
                                  {isArabic ? result.title : result.titleEn || result.title}
                                </h4>
                                {result.excerpt && (
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {isArabic ? result.excerpt : result.excerptEn || result.excerpt}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  {result.category && (
                                    <Badge variant="secondary" className="text-xs">
                                      {isArabic ? result.category : result.categoryEn || result.category}
                                    </Badge>
                                  )}
                                  {result.publishedAt && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(result.publishedAt)}
                                    </span>
                                  )}
                                  {result.rating && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {result.rating}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (variant === "header") {
    return (
      <div className="relative w-full max-w-sm" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            placeholder={placeholder || (isArabic ? "ابحث في الموقع..." : "Search site...")}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10 pr-4"
            data-testid="input-header-search"
          />
        </div>

        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-hidden z-50 shadow-xl border-border">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">{isArabic ? "جارٍ البحث..." : "Searching..."}</span>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center p-4 text-sm text-muted-foreground">
                {query.length < 2 
                  ? (isArabic ? "اكتب للبحث..." : "Type to search...")
                  : (isArabic ? "لا توجد نتائج" : "No results found")
                }
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {results.slice(0, 6).map((result, index) => (
                  <div key={result.id}>
                    {index > 0 && <Separator />}
                    <Link href={result.url} onClick={handleResultClick}>
                      <div className="p-3 hover:bg-accent cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="text-primary">
                            {getTypeIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(result.type)}
                              </Badge>
                              {result.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {isArabic ? result.category : result.categoryEn || result.category}
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium text-sm truncate">
                              {isArabic ? result.title : result.titleEn || result.title}
                            </h4>
                            {result.excerpt && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                {isArabic ? result.excerpt : result.excerptEn || result.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {results.length > 6 && (
                  <div className="p-3 text-center bg-muted">
                    <span className="text-sm text-muted-foreground">
                      +{results.length - 6} {isArabic ? "نتائج أخرى" : "more results"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            ref={inputRef}
            placeholder={placeholder || (isArabic ? "ابحث في المقالات، المشاريع، الخدمات..." : "Search articles, projects, services...")}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-12 pr-4 h-12 text-lg"
            data-testid="input-full-search"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setIsArabic(!isArabic)}
            data-testid="button-toggle-language"
          >
            {isArabic ? "En" : "عر"}
          </Button>
        </div>

        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-4 max-h-96 overflow-hidden z-50 shadow-xl">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin mr-3" />
                  <span className="text-lg">{isArabic ? "جارٍ البحث..." : "Searching..."}</span>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center p-8">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {query.length < 2 
                      ? (isArabic ? "ابدأ البحث" : "Start searching")
                      : (isArabic ? "لا توجد نتائج" : "No results found")
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {query.length < 2 
                      ? (isArabic ? "اكتب حرفين على الأقل للبحث في المحتوى" : "Type at least 2 characters to search content")
                      : (isArabic ? "جرب كلمات مفتاحية مختلفة" : "Try different keywords")
                    }
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {Object.entries(groupedResults).map(([type, typeResults], index) => (
                    <div key={type}>
                      {index > 0 && <Separator />}
                      <div className="px-6 py-3 bg-muted font-medium flex items-center gap-2">
                        {getTypeIcon(type)}
                        <span>{getTypeLabel(type)}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {typeResults.length}
                        </Badge>
                      </div>
                      {typeResults.map((result) => (
                        <Link key={result.id} href={result.url} onClick={handleResultClick}>
                          <div className="px-6 py-4 hover:bg-accent cursor-pointer border-b border-border last:border-b-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg mb-2 truncate">
                                  {isArabic ? result.title : result.titleEn || result.title}
                                </h4>
                                {result.excerpt && (
                                  <p className="text-muted-foreground line-clamp-2 mb-3">
                                    {isArabic ? result.excerpt : result.excerptEn || result.excerpt}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 flex-wrap">
                                  {result.category && (
                                    <Badge variant="secondary">
                                      {isArabic ? result.category : result.categoryEn || result.category}
                                    </Badge>
                                  )}
                                  {result.tags && result.tags.slice(0, 2).map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs">
                                      {isArabic ? tag : result.tagsEn?.[tagIndex] || tag}
                                    </Badge>
                                  ))}
                                  {result.publishedAt && (
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(result.publishedAt)}
                                    </span>
                                  )}
                                  {result.rating && (
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      {result.rating}/5
                                    </span>
                                  )}
                                  {result.clientName && (
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                      <User className="h-4 w-4" />
                                      {isArabic ? result.clientName : result.clientNameEn || result.clientName}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}