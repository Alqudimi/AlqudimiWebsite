import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { apiRequest } from "@/lib/queryClient";

type ContactInfo = {
  id: string;
  type: string;
  value: string;
  label: string;
  icon: string;
  order: number;
  isActive: boolean;
};

const messageSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون على الأقل حرفين"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  subject: z.string().min(5, "الموضوع يجب أن يكون على الأقل 5 أحرف"),
  message: z.string().min(10, "الرسالة يجب أن تكون على الأقل 10 أحرف")
});

type MessageForm = z.infer<typeof messageSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { playClickSound, playHoverSound } = useSound();
  const queryClient = useQueryClient();

  const { data: contactInfo = [], isLoading } = useQuery<ContactInfo[]>({
    queryKey: ["/api/contact-info"]
  });

  const form = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: MessageForm) => apiRequest("/api/contact", {
      method: "POST",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      toast({
        title: "تم إرسال الرسالة",
        description: "شكراً لك! سنتواصل معك قريباً",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: () => {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (data: MessageForm) => {
    setIsSubmitting(true);
    playClickSound();
    await sendMessageMutation.mutateAsync(data);
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      title: "تواصل سريع",
      description: "للاستفسارات السريعة",
      icon: "fas fa-comments",
      color: "bg-blue-500",
      action: "Live Chat"
    },
    {
      title: "مكالمة مباشرة",
      description: "للمناقشات التفصيلية",
      icon: "fas fa-phone",
      color: "bg-green-500",
      action: "Call Now"
    },
    {
      title: "البريد الإلكتروني",
      description: "للرسائل المفصلة",
      icon: "fas fa-envelope",
      color: "bg-purple-500",
      action: "Send Email"
    },
    {
      title: "واتساب",
      description: "للتواصل الفوري",
      icon: "fab fa-whatsapp",
      color: "bg-green-600",
      action: "WhatsApp"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">جاري تحميل معلومات التواصل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 pt-20">
      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                تواصل معنا
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              نحن هنا لمساعدتك في تحقيق أهدافك التقنية. تواصل معنا بالطريقة التي تفضلها
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  أرسل لنا رسالة
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-300">
                  املأ النموذج أدناه وسنتواصل معك في أقرب وقت
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300">الاسم</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="اسمك الكامل" 
                                {...field}
                                className="border-slate-300 focus:border-blue-500"
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300">البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your@email.com" 
                                type="email"
                                {...field}
                                className="border-slate-300 focus:border-blue-500"
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">موضوع الرسالة</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="ما هو موضوع رسالتك؟" 
                              {...field}
                              className="border-slate-300 focus:border-blue-500"
                              data-testid="input-subject"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300">الرسالة</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="اكتب رسالتك هنا..."
                              className="min-h-[120px] border-slate-300 focus:border-blue-500"
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                      disabled={isSubmitting}
                      onMouseEnter={playHoverSound}
                      data-testid="button-send-message"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane ml-2"></i>
                          إرسال الرسالة
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Methods */}
          <div className="space-y-8">
            {/* Quick Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                طرق التواصل السريع
              </h2>
              <div className="grid gap-4">
                {contactMethods.map((method, index) => (
                  <Card 
                    key={index}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                    onMouseEnter={playHoverSound}
                    onClick={playClickSound}
                    data-testid={`contact-method-${index}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <i className={`${method.icon} text-white text-lg`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 dark:text-white">
                            {method.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {method.description}
                          </p>
                        </div>
                        <i className="fas fa-chevron-left text-slate-400 group-hover:text-blue-600 transition-colors"></i>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                معلومات التواصل
              </h2>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  {contactInfo
                    .filter(info => info.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((info) => (
                      <div key={info.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <i className={`${info.icon} text-white`}></i>
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">
                            {info.label}
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 text-sm">
                            {info.value}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            {/* Office Hours */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                ساعات العمل
              </h2>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                      <span className="text-slate-600 dark:text-slate-300">الأحد - الخميس</span>
                      <span className="font-medium text-slate-800 dark:text-white">9:00 ص - 6:00 م</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                      <span className="text-slate-600 dark:text-slate-300">الجمعة</span>
                      <span className="font-medium text-slate-800 dark:text-white">2:00 م - 6:00 م</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 dark:text-slate-300">السبت</span>
                      <span className="font-medium text-red-600">مغلق</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}