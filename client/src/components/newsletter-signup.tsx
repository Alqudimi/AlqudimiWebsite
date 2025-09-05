import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NewsletterSignupProps {
  variant?: "default" | "compact" | "inline";
  title?: string;
  description?: string;
}

export default function NewsletterSignup({ 
  variant = "default", 
  title, 
  description 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isArabic, setIsArabic] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subscribeMutation = useMutation({
    mutationFn: async (data: { email: string; name?: string }) => {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Subscription failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isArabic ? "تم الاشتراك بنجاح!" : "Successfully subscribed!",
        description: isArabic 
          ? "سنرسل لك أحدث المقالات والتحديثات"
          : "We'll send you the latest articles and updates",
      });
      setEmail("");
      setName("");
      queryClient.invalidateQueries({ queryKey: ['/api/admin/newsletter'] });
    },
    onError: (error: any) => {
      toast({
        title: isArabic ? "خطأ في الاشتراك" : "Subscription Error",
        description: error.message || (isArabic ? "حدث خطأ ما" : "Something went wrong"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: isArabic ? "مطلوب البريد الإلكتروني" : "Email Required",
        description: isArabic ? "يرجى إدخال بريدك الإلكتروني" : "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    subscribeMutation.mutate({ 
      email: email.trim(), 
      name: name.trim() || undefined 
    });
  };

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <Input
          type="email"
          placeholder={isArabic ? "بريدك الإلكتروني" : "Your email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={subscribeMutation.isPending}
          data-testid="input-newsletter-email"
        />
        <Button 
          type="submit" 
          disabled={subscribeMutation.isPending}
          data-testid="button-newsletter-subscribe"
        >
          {subscribeMutation.isPending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm">
              {title || (isArabic ? "اشترك في النشرة البريدية" : "Subscribe to Newsletter")}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder={isArabic ? "بريدك الإلكتروني" : "Your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeMutation.isPending}
              data-testid="input-newsletter-email"
            />
            <Button 
              type="submit" 
              className="w-full" 
              size="sm"
              disabled={subscribeMutation.isPending}
              data-testid="button-newsletter-subscribe"
            >
              {subscribeMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              {isArabic ? "اشتراك" : "Subscribe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">
          {title || (isArabic ? "اشترك في النشرة البريدية" : "Subscribe to Our Newsletter")}
        </CardTitle>
        <p className="text-muted-foreground">
          {description || (isArabic 
            ? "احصل على أحدث المقالات والتحديثات التقنية مباشرة في بريدك الإلكتروني"
            : "Get the latest articles and tech updates delivered straight to your inbox"
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Input
              type="text"
              placeholder={isArabic ? "اسمك (اختياري)" : "Your name (optional)"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={subscribeMutation.isPending}
              data-testid="input-newsletter-name"
            />
            <Input
              type="email"
              placeholder={isArabic ? "بريدك الإلكتروني" : "Your email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeMutation.isPending}
              required
              data-testid="input-newsletter-email"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={subscribeMutation.isPending}
            data-testid="button-newsletter-subscribe"
          >
            {subscribeMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {isArabic ? "جارٍ الاشتراك..." : "Subscribing..."}
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                {isArabic ? "اشترك الآن" : "Subscribe Now"}
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsArabic(!isArabic)}
            data-testid="button-toggle-language"
          >
            {isArabic ? "English" : "العربية"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {isArabic 
            ? "يمكنك إلغاء الاشتراك في أي وقت. نحن نحترم خصوصيتك."
            : "You can unsubscribe at any time. We respect your privacy."
          }
        </div>
      </CardContent>
    </Card>
  );
}