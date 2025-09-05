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
import { insertCvDataSchema, type CvData } from "@shared/schema";
import { useState } from "react";

interface CVFormProps {
  cvData?: CvData;
  onClose: () => void;
}

export default function CVForm({ cvData, onClose }: CVFormProps) {
  const [skills, setSkills] = useState<string[]>(cvData?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(insertCvDataSchema),
    defaultValues: {
      type: cvData?.type || "experience",
      title: cvData?.title || "",
      titleEn: cvData?.titleEn || "",
      description: cvData?.description || "",
      descriptionEn: cvData?.descriptionEn || "",
      subtitle: cvData?.subtitle || "",
      subtitleEn: cvData?.subtitleEn || "",
      startDate: cvData?.startDate || "",
      endDate: cvData?.endDate || "",
      location: cvData?.location || "",
      locationEn: cvData?.locationEn || "",
      skills: cvData?.skills || [],
      level: cvData?.level || 1,
      url: cvData?.url || "",
      icon: cvData?.icon || "fas fa-briefcase",
      isActive: cvData?.isActive ?? true,
      order: cvData?.order || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        skills,
      };
      
      if (cvData?.id) {
        const response = await fetch(`/api/admin/cv/${cvData.id}`, {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to update CV data");
        return response.json();
      } else {
        return await apiRequest("POST", "/api/admin/cv", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cv"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cv"] });
      toast({
        title: cvData?.id ? "تم تحديث البيانات بنجاح" : "تم إضافة البيانات بنجاح",
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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const typeOptions = [
    { value: "personal", label: "معلومات شخصية" },
    { value: "summary", label: "ملخص مهني" },
    { value: "education", label: "تعليم" },
    { value: "experience", label: "خبرة" },
    { value: "skill", label: "مهارة" },
    { value: "certification", label: "شهادة" },
    { value: "project", label: "مشروع" },
    { value: "language", label: "لغة" },
    { value: "hobby", label: "هواية" },
  ];

  const iconOptions = [
    { value: "fas fa-user", label: "مستخدم" },
    { value: "fas fa-graduation-cap", label: "تخرج" },
    { value: "fas fa-briefcase", label: "حقيبة" },
    { value: "fas fa-code", label: "كود" },
    { value: "fas fa-certificate", label: "شهادة" },
    { value: "fas fa-award", label: "جائزة" },
    { value: "fas fa-trophy", label: "كأس" },
    { value: "fas fa-star", label: "نجمة" },
    { value: "fas fa-heart", label: "قلب" },
    { value: "fas fa-globe", label: "كرة أرضية" },
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {cvData?.id ? "تعديل بيانات السيرة الذاتية" : "إضافة بيانات جديدة للسيرة الذاتية"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع البيانات</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-cv-type">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأيقونة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-cv-icon">
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
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان (العربية)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-cv-title" />
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
                      <Input {...field} data-testid="input-cv-title-en" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان الفرعي (العربية)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-cv-subtitle" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subtitleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان الفرعي (الإنجليزية)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-cv-subtitle-en" />
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
                        data-testid="textarea-cv-description" 
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
                        data-testid="textarea-cv-description-en" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ البداية</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-cv-start-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ النهاية</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-cv-end-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموقع</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-cv-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المستوى (1-5)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="1" 
                        max="5"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-cv-level"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرابط</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-cv-url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills */}
            <div>
              <label className="text-sm font-medium">المهارات</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="أضف مهارة جديدة"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  data-testid="input-new-skill"
                />
                <Button type="button" onClick={addSkill} data-testid="button-add-skill">
                  إضافة
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                    <span className="text-sm">{skill}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill)}
                      className="h-4 w-4 p-0"
                      data-testid={`button-remove-skill-${skill}`}
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
                        إظهار البيانات في الموقع
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-cv-active"
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
                        data-testid="input-cv-order"
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
                data-testid="button-save-cv"
              >
                {mutation.isPending ? "جاري الحفظ..." : "حفظ البيانات"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel-cv"
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
