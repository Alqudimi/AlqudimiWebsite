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
      icon: service?.icon || "Code",
      color: service?.color || "blue",
      features: service?.features || [],
      featuresEn: service?.featuresEn || [],
      isActive: service?.isActive ?? true,
      order: service?.order || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (service?.id) {
        return apiRequest(
          "PATCH",
          `/api/admin/services/${service.id}`,
          { ...data, features, featuresEn }
        );
      } else {
        return apiRequest(
          "POST",
          "/api/admin/services",
          { ...data, features, featuresEn }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: service?.id ? "تم تحديث الخدمة بنجاح" : "تم إضافة الخدمة بنجاح",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ الخدمة. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addFeatureEn = () => {
    if (newFeatureEn.trim()) {
      setFeaturesEn([...featuresEn, newFeatureEn.trim()]);
      setNewFeatureEn("");
    }
  };

  const removeFeatureEn = (index: number) => {
    setFeaturesEn(featuresEn.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-right">
          {service?.id ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">العنوان (عربي)</FormLabel>
                    <FormControl>
                      <Input placeholder="عنوان الخدمة" {...field} className="text-right" />
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
                    <FormLabel>Title (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="Service title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">الوصف (عربي)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="وصف الخدمة" {...field} className="text-right" />
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
                    <FormLabel>Description (English)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Service description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأيقونة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر أيقونة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Code">Code</SelectItem>
                        <SelectItem value="Smartphone">Smartphone</SelectItem>
                        <SelectItem value="Monitor">Monitor</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="Cloud">Cloud</SelectItem>
                        <SelectItem value="Shield">Shield</SelectItem>
                        <SelectItem value="Zap">Zap</SelectItem>
                        <SelectItem value="Settings">Settings</SelectItem>
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
                        <SelectTrigger>
                          <SelectValue placeholder="اختر لون" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blue">أزرق</SelectItem>
                        <SelectItem value="green">أخضر</SelectItem>
                        <SelectItem value="purple">بنفسجي</SelectItem>
                        <SelectItem value="red">أحمر</SelectItem>
                        <SelectItem value="yellow">أصفر</SelectItem>
                        <SelectItem value="indigo">نيلي</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الترتيب</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Features */}
            <div>
              <FormLabel className="text-right">المميزات (عربي)</FormLabel>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="إضافة ميزة جديدة"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="text-right"
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    إضافة
                  </Button>
                </div>
                <div className="space-y-1">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        حذف
                      </Button>
                      <span className="text-right">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features English */}
            <div>
              <FormLabel>Features (English)</FormLabel>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new feature"
                    value={newFeatureEn}
                    onChange={(e) => setNewFeatureEn(e.target.value)}
                  />
                  <Button type="button" onClick={addFeatureEn} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="space-y-1">
                  {featuresEn.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeatureEn(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">نشط</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      تفعيل أو إلغاء تفعيل الخدمة
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "جاري الحفظ..." : service?.id ? "تحديث" : "إضافة"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}