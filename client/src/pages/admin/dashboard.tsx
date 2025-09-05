import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { apiRequest } from "@/lib/queryClient";
import { isAuthenticated, getAuthHeaders } from "@/lib/auth";
import ProjectForm from "@/components/admin/project-form";
import ServiceForm from "@/components/admin/service-form";
import CVForm from "@/components/admin/cv-form";
import type { Project, Service, CvData, ContactMessage } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCvData, setEditingCvData] = useState<CvData | null>(null);
  const { toast } = useToast();
  const { playClickSound } = useSound();
  const queryClient = useQueryClient();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Queries
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
    queryFn: async () => {
      const response = await fetch("/api/admin/projects", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
    enabled: isAuthenticated(),
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
    queryFn: async () => {
      const response = await fetch("/api/admin/services", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
    enabled: isAuthenticated(),
  });

  const { data: cvData = [], isLoading: cvLoading } = useQuery<CvData[]>({
    queryKey: ["/api/admin/cv"],
    queryFn: async () => {
      const response = await fetch("/api/admin/cv", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch CV data");
      return response.json();
    },
    enabled: isAuthenticated(),
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
    queryFn: async () => {
      const response = await fetch("/api/admin/messages", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: isAuthenticated(),
  });

  // Delete mutations
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/projects/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "تم حذف المشروع بنجاح" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "فشل في حذف المشروع" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/services/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({ title: "تم حذف الخدمة بنجاح" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "فشل في حذف الخدمة" });
    },
  });

  const deleteCvDataMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/cv/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cv"] });
      toast({ title: "تم حذف البيانات بنجاح" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "فشل في حذف البيانات" });
    },
  });

  const updateMessageStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      apiRequest("PUT", `/api/admin/messages/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({ title: "تم تحديث حالة الرسالة" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "فشل في تحديث حالة الرسالة" });
    },
  });

  const handleLogout = () => {
    playClickSound();
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setLocation("/admin/login");
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المشروع؟")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الخدمة؟")) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleDeleteCvData = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه البيانات؟")) {
      deleteCvDataMutation.mutate(id);
    }
  };

  const handleMarkAsRead = (id: string) => {
    updateMessageStatusMutation.mutate({ id, status: "read" });
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;

  if (!isAuthenticated()) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-cogs text-primary-foreground"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold">لوحة التحكم الإدارية</h1>
                <p className="text-sm text-muted-foreground">إدارة محتوى الموقع</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" data-testid="button-logout">
              <i className="fas fa-sign-out-alt ml-2"></i>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">المشاريع</TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">الخدمات</TabsTrigger>
            <TabsTrigger value="cv" data-testid="tab-cv">السيرة الذاتية</TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">
              الرسائل {unreadCount > 0 && <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المشاريع</CardTitle>
                  <i className="fas fa-project-diagram text-muted-foreground"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">إجمالي المشاريع</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الخدمات</CardTitle>
                  <i className="fas fa-tools text-muted-foreground"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.length}</div>
                  <p className="text-xs text-muted-foreground">إجمالي الخدمات</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">بيانات السيرة</CardTitle>
                  <i className="fas fa-user text-muted-foreground"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cvData.length}</div>
                  <p className="text-xs text-muted-foreground">عناصر السيرة الذاتية</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الرسائل</CardTitle>
                  <i className="fas fa-envelope text-muted-foreground"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount} غير مقروءة
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">إدارة المشاريع</h2>
              <Button 
                onClick={() => setEditingProject({} as Project)} 
                data-testid="button-add-project"
              >
                <i className="fas fa-plus ml-2"></i>
                إضافة مشروع جديد
              </Button>
            </div>

            {editingProject && (
              <ProjectForm
                project={editingProject.id ? editingProject : undefined}
                onClose={() => setEditingProject(null)}
              />
            )}

            <div className="grid gap-6">
              {projectsLoading ? (
                <div>جاري التحميل...</div>
              ) : (
                projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <p className="text-muted-foreground mt-2">
                            {project.shortDescription}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={project.isActive ? "default" : "secondary"}>
                              {project.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                            {project.isFeatured && (
                              <Badge variant="outline">مميز</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingProject(project)}
                            data-testid={`button-edit-project-${project.id}`}
                          >
                            تعديل
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            data-testid={`button-delete-project-${project.id}`}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">إدارة الخدمات</h2>
              <Button 
                onClick={() => setEditingService({} as Service)} 
                data-testid="button-add-service"
              >
                <i className="fas fa-plus ml-2"></i>
                إضافة خدمة جديدة
              </Button>
            </div>

            {editingService && (
              <ServiceForm
                service={editingService.id ? editingService : undefined}
                onClose={() => setEditingService(null)}
              />
            )}

            <div className="grid gap-6">
              {servicesLoading ? (
                <div>جاري التحميل...</div>
              ) : (
                services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{service.title}</CardTitle>
                          <p className="text-muted-foreground mt-2">
                            {service.description}
                          </p>
                          <Badge 
                            variant={service.isActive ? "default" : "secondary"}
                            className="mt-2"
                          >
                            {service.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingService(service)}
                            data-testid={`button-edit-service-${service.id}`}
                          >
                            تعديل
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            data-testid={`button-delete-service-${service.id}`}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="cv" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">إدارة السيرة الذاتية</h2>
              <Button 
                onClick={() => setEditingCvData({} as CvData)} 
                data-testid="button-add-cv-data"
              >
                <i className="fas fa-plus ml-2"></i>
                إضافة بيانات جديدة
              </Button>
            </div>

            {editingCvData && (
              <CVForm
                cvData={editingCvData.id ? editingCvData : undefined}
                onClose={() => setEditingCvData(null)}
              />
            )}

            <div className="grid gap-6">
              {cvLoading ? (
                <div>جاري التحميل...</div>
              ) : (
                cvData.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge>{item.type}</Badge>
                            <CardTitle>{item.title}</CardTitle>
                          </div>
                          {item.subtitle && (
                            <p className="text-muted-foreground mt-1">{item.subtitle}</p>
                          )}
                          {item.description && (
                            <p className="text-muted-foreground mt-2 text-sm">
                              {item.description.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingCvData(item)}
                            data-testid={`button-edit-cv-${item.id}`}
                          >
                            تعديل
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteCvData(item.id)}
                            data-testid={`button-delete-cv-${item.id}`}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-3xl font-bold">إدارة الرسائل</h2>

            <div className="grid gap-6">
              {messagesLoading ? (
                <div>جاري التحميل...</div>
              ) : (
                messages.map((message) => (
                  <Card key={message.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{message.subject}</CardTitle>
                            <Badge 
                              variant={message.status === "unread" ? "destructive" : "secondary"}
                            >
                              {message.status === "unread" ? "غير مقروءة" : "مقروءة"}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p><strong>من:</strong> {message.name}</p>
                            <p><strong>البريد:</strong> {message.email}</p>
                            {message.serviceType && (
                              <p><strong>نوع الخدمة:</strong> {message.serviceType}</p>
                            )}
                            <p><strong>التاريخ:</strong> {new Date(message.createdAt).toLocaleString('ar')}</p>
                          </div>
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {message.status === "unread" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkAsRead(message.id)}
                              data-testid={`button-mark-read-${message.id}`}
                            >
                              وضع علامة مقروءة
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
              
              {messages.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <i className="fas fa-inbox text-4xl text-muted-foreground mb-4"></i>
                    <p className="text-muted-foreground">لا توجد رسائل</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
