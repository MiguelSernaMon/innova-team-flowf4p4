// InnoSistemas Platform API - GraphQL Integration
// Real backend integration using Apollo Client

import client from './apollo';
import {
  LOGIN_MUTATION,
  REFRESH_TOKEN_MUTATION,
  LOGOUT_MUTATION,
  LOGOUT_ALL_DEVICES_MUTATION,
  GET_CURRENT_USER,
  GET_USER_PERMISSIONS,
  GET_TEAM_MEMBERS,
  GET_ALL_TEAMS,
  GET_COURSE_MEMBERS,
} from './graphql/queries';
import type {
  AuthResponse,
  LogoutResponse,
  LogoutAllResponse,
  User,
  UserPermissions,
  TeamMember,
  Team,
  Notification,
  NotificationStats,
  NotificationType,
  NotificationStatus,
} from './types';

// Re-export types for backwards compatibility
export type { NotificationType, NotificationStatus, Notification, NotificationStats };

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  admin: {
    email: "admin@udea.edu.co",
    password: "admin123",
    role: "ADMIN"
  },
  professor: {
    email: "profesor@udea.edu.co",
    password: "password123",
    role: "PROFESSOR"
  },
  student: {
    email: "estudiante@udea.edu.co",
    password: "password123",
    role: "STUDENT"
  }
};

// ==================== AUTHENTICATION API ====================

export const authAPI = {
  async login(email: string, password: string) {
    try {
      const { data } = await client.mutate<{ login: AuthResponse }>({
        mutation: LOGIN_MUTATION,
        variables: { email, password },
      });

      if (data?.login) {
        // Store tokens in localStorage
        localStorage.setItem('authToken', data.login.token);
        localStorage.setItem('refreshToken', data.login.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.login.userInfo));
        localStorage.setItem('userRole', data.login.userInfo.role);

        return {
          success: true,
          user: {
            id: data.login.userInfo.id,
            name: data.login.userInfo.fullName,
            email: data.login.userInfo.email,
            role: data.login.userInfo.role.toLowerCase(),
            avatar: `/api/avatar/${data.login.userInfo.id}`,
          },
          token: data.login.token,
        };
      }

      throw new Error('Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Credenciales inválidas');
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await client.mutate<{ logout: LogoutResponse }>({
          mutation: LOGOUT_MUTATION,
          variables: { token },
        });
      }

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');

      // Clear Apollo cache
      await client.clearStore();

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      return { success: true };
    }
  },

  async logoutFromAllDevices() {
    try {
      const { data } = await client.mutate<{ logoutFromAllDevices: LogoutAllResponse }>({
        mutation: LOGOUT_ALL_DEVICES_MUTATION,
      });

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');

      // Clear Apollo cache
      await client.clearStore();

      return {
        success: data?.logoutFromAllDevices?.success || false,
        message: data?.logoutFromAllDevices?.message || '',
        sessionsTerminated: data?.logoutFromAllDevices?.sessionsTerminated || 0,
      };
    } catch (error) {
      console.error('Logout from all devices error:', error);
      throw error;
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await client.mutate<{ refreshToken: AuthResponse }>({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: { refreshToken },
      });

      if (data?.refreshToken) {
        localStorage.setItem('authToken', data.refreshToken.token);
        localStorage.setItem('refreshToken', data.refreshToken.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.refreshToken.userInfo));

        return { success: true, token: data.refreshToken.token };
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Refresh token error:', error);
      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { data } = await client.query<{ getCurrentUser: User }>({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only',
      });

      if (data?.getCurrentUser) {
        const user = {
          id: data.getCurrentUser.id,
          name: data.getCurrentUser.fullName,
          email: data.getCurrentUser.email,
          role: data.getCurrentUser.role.toLowerCase(),
          avatar: `/api/avatar/${data.getCurrentUser.id}`,
        };

        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }

      throw new Error('Failed to get current user');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  async getUserPermissions() {
    try {
      const { data } = await client.query<{ getUserPermissions: UserPermissions }>({
        query: GET_USER_PERMISSIONS,
        fetchPolicy: 'network-only',
      });

      return { success: true, permissions: data?.getUserPermissions };
    } catch (error) {
      console.error('Get user permissions error:', error);
      throw error;
    }
  },
};

// ==================== TEAMS API ====================

export const teamsAPI = {
  async getTeamMembers(teamId: string) {
    try {
      const { data } = await client.query<{ getTeamMembers: TeamMember[] }>({
        query: GET_TEAM_MEMBERS,
        variables: { teamId },
        fetchPolicy: 'network-only',
      });

      const members = data?.getTeamMembers?.map(member => ({
        id: member.id,
        teamId: member.teamId,
        name: member.fullName,
        role: member.role,
        roleColor: getRoleColor(member.role),
        email: member.email,
      })) || [];

      return { success: true, members };
    } catch (error) {
      console.error('Get team members error:', error);
      throw error;
    }
  },

  async getAllTeams() {
    try {
      const { data } = await client.query<{ getAllTeams: Team[] }>({
        query: GET_ALL_TEAMS,
        fetchPolicy: 'network-only',
      });

      const teams = data?.getAllTeams?.map(team => ({
        id: team.teamId,
        name: `Team ${team.teamId}`,
        members: team.members.length,
        membersList: team.members,
      })) || [];

      return { success: true, teams };
    } catch (error) {
      console.error('Get all teams error:', error);
      throw error;
    }
  },

  // Mock implementations for features not yet in backend
  async getTeams() {
    // This is a mock - replace with real GraphQL query when available
    return this.getAllTeams();
  },

  async createTeam(teamData: { name: string; description: string; maxMembers: number }) {
    // TODO: Implement when backend supports it
    console.warn('createTeam not yet implemented in backend');
    throw new Error('Not implemented');
  },

  async joinTeam(teamId: string) {
    // TODO: Implement when backend supports it
    console.warn('joinTeam not yet implemented in backend');
    throw new Error('Not implemented');
  },

  async getTeamNotifications(teamId: string) {
    // TODO: Replace with real notification query when available
    return { success: true, notifications: [] };
  },
};

// ==================== NOTIFICATIONS API ====================

export const notificationsAPI = {
  async getNotifications(filters?: { type?: string; status?: string; search?: string }) {
    // TODO: Implement with real GraphQL query when backend supports it
    // For now, return empty array
    const notifications: Notification[] = [];
    const stats: NotificationStats = {
      total: 0,
      unread: 0,
      read: 0,
    };

    return { success: true, notifications, stats };
  },

  async markAsRead(notificationId: string) {
    // TODO: Implement when backend supports it
    return { success: true };
  },

  async markAllAsRead() {
    // TODO: Implement when backend supports it
    return { success: true };
  },
};

// ==================== COURSE API ====================

export const courseAPI = {
  async getCourseMembers(courseId: string) {
    try {
      const { data } = await client.query<{ getCourseMembers: TeamMember[] }>({
        query: GET_COURSE_MEMBERS,
        variables: { courseId },
        fetchPolicy: 'network-only',
      });

      const members = data?.getCourseMembers?.map(member => ({
        id: member.id,
        courseId: member.courseId,
        teamId: member.teamId,
        name: member.fullName,
        role: member.role,
        email: member.email,
      })) || [];

      return { success: true, members };
    } catch (error) {
      console.error('Get course members error:', error);
      throw error;
    }
  },
};

// ==================== PROJECTS API (MOCK) ====================

export const projectsAPI = {
  async getProjects(filters?: { status?: string; team?: string }) {
    // TODO: Implement with real GraphQL query when backend supports it
    return { success: true, projects: [] };
  },

  async createProject(projectData: any) {
    // TODO: Implement when backend supports it
    throw new Error('Not implemented');
  },

  async updateProject(projectId: string, updates: any) {
    // TODO: Implement when backend supports it
    throw new Error('Not implemented');
  },
};

// ==================== DASHBOARD API (MOCK) ====================

export const dashboardAPI = {
  async getDashboardStats() {
    // TODO: Implement with real GraphQL queries
    const stats = {
      totalProjects: 0,
      activeTeams: 0,
      completedTasks: 0,
      upcomingDeadlines: 0,
      notifications: {
        total: 0,
        unread: 0,
      },
      recentActivity: [],
    };

    return { success: true, stats };
  },
};

// ==================== HELPER FUNCTIONS ====================

function getRoleColor(role: string): string {
  const roleColors: Record<string, string> = {
    ADMIN: 'bg-admin text-white',
    PROFESSOR: 'bg-primary text-primary-foreground',
    TA: 'bg-secondary text-secondary-foreground',
    STUDENT: 'bg-team text-white',
  };

  return roleColors[role] || 'bg-muted text-muted-foreground';
}
