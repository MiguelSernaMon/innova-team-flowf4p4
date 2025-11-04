// ==================== USER TYPES ====================

export enum UserRole {
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR',
  TA = 'TA',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  fullName: string;
  teamId?: string;
  courseId?: string;
  enabled?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
}

export interface UserPermissions {
  userId: string;
  role: UserRole;
  permissions: string[];
  teamId?: string;
  courseId?: string;
  canManageTeam: boolean;
  canManageCourse: boolean;
  canViewAllTeams: boolean;
  canSendNotifications: boolean;
}

// ==================== AUTH TYPES ====================

export interface AuthResponse {
  token: string;
  refreshToken: string;
  userInfo: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface LogoutAllResponse {
  success: boolean;
  message: string;
  sessionsTerminated: number;
}

// ==================== TEAM TYPES ====================

export interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  teamId?: string;
  courseId?: string;
}

export interface Team {
  teamId: string;
  members: TeamMember[];
}

// ==================== NOTIFICATION TYPES ====================

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

// ==================== API RESPONSE TYPES ====================

export interface ApiError {
  message: string;
  extensions?: {
    classification?: string;
  };
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: ApiError[];
}
