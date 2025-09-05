import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import { insertServiceSchema, type Service } from "@shared/schema";
import { useState } from "react";

interface ServiceFormProps {
  service?: Service;
  onClose: () => void;
}

export default function ServiceForm({ service, onClose }: ServiceFormProps) {
  const [features, setFeatures] = useState<string[]>(service?.features || []);
  const [featuresEn, setFeaturesEn] = useState<string[]>(service?.featuresEn || []);
  const [newFeature, setNewFeature] = useState("");
  const [newFeatureEn, setNewFeatureEn] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      title: service?.title || "",
      titleEn: service?.titleEn || "",
      description: service?.description || "",
      descriptionEn: service?.descriptionEn || "",
      icon: service?.icon || "fas fa-cog",
      color: service?.color || "blue",
      features: service?.features || [],
      featuresEn: service?.featuresEn || [],
      isActive: service?.isActive ?? true,
      order: service?.order || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        features,
        featuresEn,
      };
      
      if (service?.id) {
        const response = await fetch(`/api/admin/services/${service.id}`, {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to update service");
        return response.json();
      } else {
        return await apiRequest("POST", "/api/admin/services", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: service?.id ? "تم تحديث الخدمة بنجاح" : "تم إضافة الخدمة بنجاح",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      });
    },
  });

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const addFeatureEn = () => {
    if (newFeatureEn.trim() && !featuresEn.includes(newFeatureEn.trim())) {
      setFeaturesEn([...featuresEn, newFeatureEn.trim()]);
      setNewFeatureEn("");
    }
  };

  const removeFeatureEn = (feature: string) => {
    setFeaturesEn(featuresEn.filter(f => f !== feature));
  };

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const colorOptions = [
    { value: "blue", label: "أزرق" },
    { value: "green", label: "أخضر" },
    { value: "purple", label: "بنفسجي" },
    { value: "orange", label: "برتقالي" },
    { value: "cyan", label: "سماوي" },
    { value: "red", label: "أحمر" },
    { value: "pink", label: "وردي" },
    { value: "indigo", label: "نيلي" },
  ];

  const iconOptions = [
    { value: "fas fa-globe", label: "موقع ويب" },
    { value: "fas fa-mobile-alt", label: "موبايل" },
    { value: "fas fa-brain", label: "ذكاء اصطناعي" },
    { value: "fas fa-database", label: "قاعدة بيانات" },
    { value: "fas fa-cloud", label: "سحابة" },
    { value: "fas fa-shield-alt", label: "أمان" },
    { value: "fas fa-cog", label: "إعدادات" },
    { value: "fas fa-code", label: "برمجة" },
    { value: "fas fa-tools", label: "أدوات" },
    { value: "fas fa-rocket", label: "صاروخ" },
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {service?.id ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان (العربية)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-service-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان (الإنجليزية)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-service-title-en" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف (العربية)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        data-testid="textarea-service-description" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف (الإنجليزية)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        data-testid="textarea-service-description-en" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأيقونة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-service-icon">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <i className={icon.value}></i>
                              {icon.label}
                            </div>
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
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اللون</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-service-color">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Features Arabic */}
            <div>
              <label className="text-sm font-medium">الميزات (العربية)</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="أضف ميزة جديدة"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  data-testid="input-new-feature"
                />
                <Button type="button" onClick={addFeature} data-testid="button-add-feature">
                  إضافة
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(feature)}
                      className="h-4 w-4 p-0"
                      data-testid={`button-remove-feature-${feature}`}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Features English */}
            <div>
              <label className="text-sm font-medium">الميزات (الإنجليزية)</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newFeatureEn}
                  onChange={(e) => setNewFeatureEn(e.target.value)}
                  placeholder="Add new feature"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeatureEn())}
                  data-testid="input-new-feature-en"
                />
                <Button type="button" onClick={addFeatureEn} data-testid="button-add-feature-en">
                  إضافة
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {featuresEn.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeatureEn(feature)}
                      className="h-4 w-4 p-0"
                      data-testid={`button-remove-feature-en-${feature}`}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">نشط</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        إظهار الخدمة في الموقع
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-service-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ترتيب العرض</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-service-order"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                data-testid="button-save-service"
              >
                {mutation.isPending ? "جاري الحفظ..." : "حفظ الخدمة"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel-service"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
