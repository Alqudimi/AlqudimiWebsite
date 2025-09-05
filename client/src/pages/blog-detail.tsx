import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Eye, ArrowLeft, Share2, Tag } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

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

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [isArabic, setIsArabic] = useState(true);

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog', { category: post?.category }],
    enabled: !!post,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isArabic ? post?.title : post?.titleEn || post?.title,
          text: isArabic ? post?.excerpt : post?.excerptEn || post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">
            {isArabic ? "المقال غير موجود" : "Article not found"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isArabic 
              ? "عذراً، لا يمكن العثور على المقال المطلوب"
              : "Sorry, the requested article could not be found"
            }
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isArabic ? "العودة للمدونة" : "Back to Blog"}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const filteredRelatedPosts = relatedPosts
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isArabic ? "العودة للمدونة" : "Back to Blog"}
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <article className="mb-12">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  {isArabic ? post.category : post.categoryEn || post.category}
                </Badge>
                {post.isFeatured && (
                  <Badge variant="outline">
                    {isArabic ? "مميز" : "Featured"}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsArabic(!isArabic)}
                  data-testid="button-toggle-language"
                >
                  {isArabic ? "English" : "العربية"}
                </Button>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {isArabic ? post.title : post.titleEn || post.title}
              </h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} {isArabic ? "دقائق" : "min read"}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {post.viewCount} {isArabic ? "مشاهدة" : "views"}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={sharePost} data-testid="button-share">
                  <Share2 className="h-4 w-4 mr-2" />
                  {isArabic ? "مشاركة" : "Share"}
                </Button>
              </div>

              {post.featuredImage && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={isArabic ? post.title : post.titleEn || post.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: isArabic ? post.content : post.contentEn || post.content 
                }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-8">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {(isArabic ? post.tags : post.tagsEn || post.tags).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-8" />

            {/* Share Section */}
            <div className="text-center py-6">
              <h3 className="text-lg font-semibold mb-4">
                {isArabic ? "أعجبك المقال؟ شاركه!" : "Enjoyed this article? Share it!"}
              </h3>
              <Button onClick={sharePost} data-testid="button-share-bottom">
                <Share2 className="h-4 w-4 mr-2" />
                {isArabic ? "مشاركة المقال" : "Share Article"}
              </Button>
            </div>
          </article>

          {/* Related Posts */}
          {filteredRelatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">
                {isArabic ? "مقالات ذات صلة" : "Related Articles"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredRelatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group hover:shadow-lg transition-shadow">
                    {relatedPost.featuredImage && (
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={relatedPost.featuredImage} 
                          alt={isArabic ? relatedPost.title : relatedPost.titleEn || relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {isArabic ? relatedPost.category : relatedPost.categoryEn || relatedPost.category}
                      </Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {isArabic ? relatedPost.title : relatedPost.titleEn || relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {isArabic ? relatedPost.excerpt : relatedPost.excerptEn || relatedPost.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}