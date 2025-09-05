import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { playClickSound } = useSound();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      playClickSound();
      
      const response = await apiRequest("POST", "/api/admin/login", data);
      const result = await response.json();
      
      // Store token in localStorage
      localStorage.setItem("admin_token", result.token);
      localStorage.setItem("admin_user", JSON.stringify(result.user));
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `أهلاً بك ${result.user.username}`,
      });
      
      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: error instanceof Error ? error.message : "فشل في تسجيل الدخول",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5" dir="rtl">
      <div className="particle-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
      </div>
      
      <Card className="w-full max-w-md mx-4 glass-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-shield-alt text-white text-2xl"></i>
          </div>
          <CardTitle className="text-2xl gradient-text">لوحة التحكم الإدارية</CardTitle>
          <p className="text-muted-foreground">سجل الدخول للوصول إلى لوحة التحكم</p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المستخدم</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="أدخل اسم المستخدم"
                        className="form-input"
                        data-testid="input-username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        className="form-input"
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
                data-testid="button-login"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin ml-2"></i>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt ml-2"></i>
                    تسجيل الدخول
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
