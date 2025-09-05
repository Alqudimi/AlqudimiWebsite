import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Eye, Search, Tag } from "lucide-react";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  content: string;
  contentEn: string;
  excerpt: string;
  excerptEn: string;
  featuredImage: string;
  tags: string[];
  tagsEn: string[];
  category: string;
  categoryEn: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string;
  viewCount: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isArabic, setIsArabic] = useState(true);

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  const { data: featuredPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog', { featured: true }],
  });

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const title = isArabic ? post.title : post.titleEn || post.title;
    const excerpt = isArabic ? post.excerpt : post.excerptEn || post.excerpt;
    const category = isArabic ? post.category : post.categoryEn || post.category;
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(blogPosts.map(post => 
    isArabic ? post.category : post.categoryEn || post.category
  )));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
            {isArabic ? "المدونة التقنية" : "Tech Blog"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic 
              ? "اكتشف أحدث المقالات والتقنيات في عالم التطوير والبرمجة"
              : "Discover the latest articles and technologies in development and programming"
            }
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tag className="h-6 w-6 text-primary" />
              {isArabic ? "المقالات المميزة" : "Featured Posts"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  {post.featuredImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.featuredImage} 
                        alt={isArabic ? post.title : post.titleEn || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">
                        {isArabic ? post.category : post.categoryEn || post.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {isArabic ? "مميز" : "Featured"}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {isArabic ? post.title : post.titleEn || post.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {isArabic ? post.excerpt : post.excerptEn || post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readingTime} {isArabic ? "دقائق" : "min"}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.viewCount}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={isArabic ? "ابحث في المقالات..." : "Search articles..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-blog"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-blog-category">
              <SelectValue placeholder={isArabic ? "اختر التصنيف" : "Select category"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? "جميع التصنيفات" : "All categories"}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
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

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              {post.featuredImage && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={isArabic ? post.title : post.titleEn || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">
                    {isArabic ? post.category : post.categoryEn || post.category}
                  </Badge>
                  {post.tags && post.tags.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {isArabic ? post.tags[0] : post.tagsEn?.[0] || post.tags[0]}
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {isArabic ? post.title : post.titleEn || post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {isArabic ? post.excerpt : post.excerptEn || post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} {isArabic ? "د" : "m"}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.viewCount}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredPosts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isArabic ? "لا توجد مقالات" : "No articles found"}
            </h3>
            <p className="text-muted-foreground">
              {isArabic 
                ? "جرب تغيير معايير البحث أو التصفية"
                : "Try changing your search or filter criteria"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}