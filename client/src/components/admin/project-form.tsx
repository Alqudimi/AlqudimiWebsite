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
import { insertProjectSchema, type Project } from "@shared/schema";
import { useState } from "react";

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || []);
  const [images, setImages] = useState<string[]>(project?.images || []);
  const [newTech, setNewTech] = useState("");
  const [newImage, setNewImage] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: project?.title || "",
      titleEn: project?.titleEn || "",
      description: project?.description || "",
      descriptionEn: project?.descriptionEn || "",
      shortDescription: project?.shortDescription || "",
      shortDescriptionEn: project?.shortDescriptionEn || "",
      technologies: project?.technologies || [],
      images: project?.images || [],
      liveUrl: project?.liveUrl || "",
      githubUrl: project?.githubUrl || "",
      category: project?.category || "web",
      isActive: project?.isActive ?? true,
      isFeatured: project?.isFeatured ?? false,
      order: project?.order || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        technologies,
        images,
      };
      
      if (project?.id) {
        const response = await fetch(`/api/admin/projects/${project.id}`, {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to update project");
        return response.json();
      } else {
        return await apiRequest("POST", "/api/admin/projects", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: project?.id ? "تم تحديث المشروع بنجاح" : "تم إضافة المشروع بنجاح",
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

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (image: string) => {
    setImages(images.filter(i => i !== image));
  };

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const categories = [
    { value: "web", label: "تطوير الويب" },
    { value: "mobile", label: "تطبيقات الموبايل" },
    { value: "ai", label: "الذكاء الاصطناعي" },
    { value: "desktop", label: "تطبيقات سطح المكتب" },
    { value: "blockchain", label: "البلوك تشين" },
    { value: "iot", label: "إنترنت الأشياء" },
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {project?.id ? "تعديل المشروع" : "إضافة مشروع جديد"}
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
                      <Input {...field} data-testid="input-project-title" />
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
                      <Input {...field} data-testid="input-project-title-en" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف التفصيلي</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={6} 
                      data-testid="textarea-project-description" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف المختصر</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3} 
                        data-testid="textarea-project-short-description" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفئة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-project-category">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="text-sm font-medium">التقنيات المستخدمة</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="أضف تقنية جديدة"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                  data-testid="input-new-technology"
                />
                <Button type="button" onClick={addTechnology} data-testid="button-add-technology">
                  إضافة
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {technologies.map((tech) => (
                  <div key={tech} className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                    <span className="text-sm">{tech}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTechnology(tech)}
                      className="h-4 w-4 p-0"
                      data-testid={`button-remove-tech-${tech}`}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="text-sm font-medium">صور المشروع</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="رابط الصورة"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  data-testid="input-new-image"
                />
                <Button type="button" onClick={addImage} data-testid="button-add-image">
                  إضافة
                </Button>
              </div>
              <div className="space-y-2 mt-3">
                {images.map((image, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <img src={image} alt={`صورة ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                    <span className="flex-1 text-sm truncate">{image}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(image)}
                      data-testid={`button-remove-image-${index}`}
                    >
                      حذف
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط المشروع المباشر</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-project-live-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الكود المصدري</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-project-github-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">نشط</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        إظهار المشروع في الموقع
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-project-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">مميز</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        عرض في المشاريع المميزة
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-project-featured"
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
                        data-testid="input-project-order"
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
                data-testid="button-save-project"
              >
                {mutation.isPending ? "جاري الحفظ..." : "حفظ المشروع"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel-project"
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
