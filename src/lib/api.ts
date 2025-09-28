// Mock API endpoints for InnoSistemas platform
// These are placeholder endpoints that simulate backend calls

const API_BASE_URL = "/api/v1";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Demo credentials
export const DEMO_CREDENTIALS = {
  email: "demo@example.com",
  password: "demo1234",
};

// Types
export type NotificationType = "alert" | "team" | "admin" | "project";
export type NotificationStatus = "read" | "unread";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
  link?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

// User Authentication
export const authAPI = {
  async login(email: string, password: string) {
    await delay(1000); // Simulate network delay
    
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const user = {
        id: "1",
        name: "Demo User",
        email: email,
        role: "student",
        avatar: "/api/avatar/1",
      };
      
      // Store user in localStorage for demo
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", "demo-token-123");
      
      return { success: true, user, token: "demo-token-123" };
    } else {
      throw new Error("Credenciales inválidas");
    }
  },

  async logout() {
    await delay(500);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return { success: true };
  },

  async getCurrentUser() {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (user && token) {
      return { success: true, user: JSON.parse(user) };
    } else {
      throw new Error("No authenticated user");
    }
  },
};

// Notifications API
export const notificationsAPI = {
  async getNotifications(filters?: { type?: string; status?: string; search?: string }) {
    await delay(800);
    
    let notifications: Notification[] = [
      {
        id: "1",
        title: "Nueva asignación de proyecto",
        description: "Se te ha asignado al proyecto 'Sistema de Gestión Académica' del equipo Alpha.",
        type: "project" as NotificationType,
        status: "unread" as NotificationStatus,
        createdAt: "2025-09-21T17:35:00Z",
        link: "/projects/1",
      },
      {
        id: "2", 
        title: "Evaluación completada",
        description: "Tu evaluación del Sprint 2 ha sido completada por el instructor.",
        type: "alert" as NotificationType,
        status: "unread" as NotificationStatus,
        createdAt: "2025-09-21T15:20:00Z",
        link: "/evaluations/2",
      },
      {
        id: "3",
        title: "Reunión de equipo programada",
        description: "Reunión de retrospectiva programada para mañana a las 10:00 AM.",
        type: "team" as NotificationType,
        status: "read" as NotificationStatus,
        createdAt: "2025-09-20T09:15:00Z",
        link: "/meetings/3",
      },
      {
        id: "4",
        title: "Actualización del sistema",
        description: "La plataforma será actualizada el próximo fin de semana.",
        type: "admin" as NotificationType,
        status: "read" as NotificationStatus,
        createdAt: "2025-09-19T14:30:00Z",
        link: "/system-updates",
      },
    ];

    // Apply filters
    if (filters?.type && filters.type !== "all") {
      notifications = notifications.filter(n => n.type === filters.type);
    }
    
    if (filters?.status && filters.status !== "all") {
      notifications = notifications.filter(n => n.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      notifications = notifications.filter(n => 
        n.title.toLowerCase().includes(search) || 
        n.description.toLowerCase().includes(search)
      );
    }

    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter(n => n.status === "unread").length,
      read: notifications.filter(n => n.status === "read").length,
    };

    return { success: true, notifications, stats };
  },

  async markAsRead(notificationId: string) {
    await delay(500);
    // In a real app, this would update the notification status
    return { success: true };
  },

  async markAllAsRead() {
    await delay(800);
    // In a real app, this would mark all notifications as read
    return { success: true };
  },
};

// Teams API
export const teamsAPI = {
  async getTeams() {
    await delay(1000);
    
    const teams = [
      {
        id: "1",
        name: "Team Alpha",
        project: "Sistema de Gestión Académica",
        members: 5,
        status: "active",
        progress: 75,
        nextMeeting: "2025-09-22T10:00:00Z",
      },
      {
        id: "2",
        name: "Team Beta",
        project: "Plataforma E-learning",
        members: 4,
        status: "planning",
        progress: 25,
        nextMeeting: "2025-09-23T14:00:00Z",
      },
    ];

    return { success: true, teams };
  },

  async createTeam(teamData: { name: string; description: string; maxMembers: number }) {
    await delay(1200);
    
    const newTeam = {
      id: Date.now().toString(),
      ...teamData,
      members: 1,
      status: "forming",
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    return { success: true, team: newTeam };
  },

  async joinTeam(teamId: string) {
    await delay(800);
    // In a real app, this would add the user to the team
    return { success: true, message: "Te has unido al equipo exitosamente" };
  },
};

// Projects API
export const projectsAPI = {
  async getProjects(filters?: { status?: string; team?: string }) {
    await delay(1000);
    
    let projects = [
      {
        id: "1",
        title: "Sistema de Gestión Académica",
        description: "Desarrollo de un sistema completo para gestión de estudiantes y cursos",
        status: "in-progress",
        team: "Team Alpha",
        progress: 75,
        dueDate: "2025-12-15T00:00:00Z",
        technologies: ["React", "Node.js", "PostgreSQL"],
      },
      {
        id: "2",
        title: "Plataforma E-learning",
        description: "Plataforma interactiva para cursos en línea con gamificación",
        status: "planning",
        team: "Team Beta",
        progress: 25,
        dueDate: "2025-11-30T00:00:00Z",
        technologies: ["Vue.js", "Django", "MySQL"],
      },
    ];

    // Apply filters
    if (filters?.status && filters.status !== "all") {
      projects = projects.filter(p => p.status === filters.status);
    }
    
    if (filters?.team && filters.team !== "all") {
      projects = projects.filter(p => p.team === filters.team);
    }

    return { success: true, projects };
  },

  async createProject(projectData: any) {
    await delay(1500);
    
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      status: "planning",
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    return { success: true, project: newProject };
  },

  async updateProject(projectId: string, updates: any) {
    await delay(1000);
    // In a real app, this would update the project in the database
    return { success: true, message: "Proyecto actualizado exitosamente" };
  },
};

// Dashboard API
export const dashboardAPI = {
  async getDashboardStats() {
    await delay(800);
    
    const stats = {
      totalProjects: 2,
      activeTeams: 1,
      completedTasks: 24,
      upcomingDeadlines: 3,
      notifications: {
        total: 4,
        unread: 2,
      },
      recentActivity: [
        {
          id: "1",
          type: "project_update",
          message: "Nuevo commit en Sistema de Gestión Académica",
          timestamp: "2025-09-21T16:30:00Z",
        },
        {
          id: "2", 
          type: "team_meeting",
          message: "Reunión completada con Team Alpha",
          timestamp: "2025-09-21T14:00:00Z",
        },
      ],
    };

    return { success: true, stats };
  },
};