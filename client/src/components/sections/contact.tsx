import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { apiRequest } from "@/lib/queryClient";
import type { ContactInfo } from "@shared/schema";

const contactFormSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  subject: z.string().min(1, "الموضوع مطلوب"),
  serviceType: z.string().optional(),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const { playClickSound, playHoverSound, playNotificationSound } = useSound();
  const queryClient = useQueryClient();

  const { data: contactInfo = [] } = useQuery<ContactInfo[]>({
    queryKey: ["/api/contact-info"],
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      serviceType: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: ContactFormData) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      playNotificationSound();
      toast({
        title: "تم إرسال الرسالة بنجاح!",
        description: "سنتواصل معك في أقرب وقت ممكن",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "خطأ في إرسال الرسالة",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    playClickSound();
    submitMutation.mutate(data);
  };

  // Default contact information in case API fails
  const defaultContactInfo = [
    {
      type: "email",
      label: "البريد الإلكتروني الأول",
      value: "eng7mi@gmail.com",
      icon: "fas fa-envelope",
      isPrimary: true,
    },
    {
      type: "email", 
      label: "البريد الإلكتروني الثاني",
      value: "abodx1234freey@gmail.com",
      icon: "fas fa-envelope",
      isPrimary: false,
    },
    {
      type: "phone",
      label: "رقم الهاتف",
      value: "+967771442176",
      icon: "fas fa-phone",
      isPrimary: true,
    },
    {
      type: "address",
      label: "الموقع",
      value: "صنعاء، اليمن",
      icon: "fas fa-map-marker-alt",
      isPrimary: true,
    },
  ];

  const displayContactInfo = contactInfo.length > 0 ? contactInfo : defaultContactInfo;
  
  const emails = displayContactInfo.filter(info => info.type === "email");
  const phones = displayContactInfo.filter(info => info.type === "phone");
  const addresses = displayContactInfo.filter(info => info.type === "address");

  const serviceOptions = [
    { value: "web-development", label: "تطوير موقع ويب" },
    { value: "mobile-development", label: "تطوير تطبيق موبايل" },
    { value: "ai-services", label: "خدمات الذكاء الاصطناعي" },
    { value: "database-management", label: "إدارة قواعد البيانات" },
    { value: "cloud-services", label: "الخدمات السحابية" },
    { value: "cybersecurity", label: "الأمن السيبراني" },
    { value: "consultation", label: "استشارة تقنية" },
    { value: "other", label: "أخرى" },
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">تواصل معنا</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            هل لديك مشروع أو فكرة تريد تطويرها؟ تواصل معنا لنناقش كيف يمكننا مساعدتك في تحقيق أهدافك
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8 scroll-reveal">
            <Card className="p-8 glass-card" data-testid="contact-info-card">
              <h3 className="text-2xl font-bold mb-6">معلومات الاتصال</h3>
              <div className="space-y-6">
                {/* Email */}
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className={`${email.icon} text-primary`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">{email.label}</h4>
                      <a
                        href={`mailto:${email.value}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onMouseEnter={playHoverSound}
                        data-testid={`email-${index}`}
                      >
                        {email.value}
                      </a>
                    </div>
                  </div>
                ))}

                {/* Phone */}
                {phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <i className={`${phone.icon} text-secondary`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">{phone.label}</h4>
                      <a
                        href={`tel:${phone.value}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onMouseEnter={playHoverSound}
                        data-testid={`phone-${index}`}
                      >
                        {phone.value}
                      </a>
                    </div>
                  </div>
                ))}

                {/* Location */}
                {addresses.map((address, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <i className={`${address.icon} text-accent-foreground`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">{address.label}</h4>
                      <p className="text-muted-foreground">{address.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-8 glass-card" data-testid="social-media-card">
              <h3 className="text-2xl font-bold mb-6">وسائل التواصل الاجتماعي</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/eng_7mi?igsh=MXhib3J4eHI2dnZ0dA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link bg-gradient-to-r from-pink-500 to-purple-600"
                  onMouseEnter={playHoverSound}
                  data-testid="social-instagram-main"
                >
                  <i className="fab fa-instagram text-xl"></i>
                  <span>Instagram</span>
                </a>
                <a
                  href="#"
                  className="social-link bg-blue-600"
                  onMouseEnter={playHoverSound}
                  data-testid="social-linkedin-main"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="#"
                  className="social-link bg-gray-800"
                  onMouseEnter={playHoverSound}
                  data-testid="social-github-main"
                >
                  <i className="fab fa-github text-xl"></i>
                  <span>GitHub</span>
                </a>
                <a
                  href="#"
                  className="social-link bg-blue-500"
                  onMouseEnter={playHoverSound}
                  data-testid="social-twitter-main"
                >
                  <i className="fab fa-twitter text-xl"></i>
                  <span>Twitter</span>
                </a>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8 scroll-reveal glass-card" data-testid="contact-form-card">
            <h3 className="text-2xl font-bold mb-6">أرسل رسالة</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="contact-form">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="أدخل اسمك الكامل"
                            className="form-input"
                            data-testid="input-contact-name"
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
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            className="form-input"
                            data-testid="input-contact-email"
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
                      <FormLabel>الموضوع</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="موضوع الرسالة"
                          className="form-input"
                          data-testid="input-contact-subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الخدمة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="form-input" data-testid="select-service-type">
                            <SelectValue placeholder="اختر نوع الخدمة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرسالة</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="اكتب رسالتك هنا..."
                          className="form-input resize-none"
                          data-testid="textarea-contact-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  onMouseEnter={playHoverSound}
                  className="w-full btn-primary"
                  data-testid="button-send-message"
                >
                  {submitMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin ml-2"></i>
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
          </Card>
        </div>
      </div>
    </section>
  );
}
