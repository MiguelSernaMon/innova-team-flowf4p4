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

// ==================== WEBSOCKET TYPES ====================

export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: string;
}

export interface WSNotificationMessage {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'TEAM_UPDATE' | 'ADMIN';
  userId?: string;
  teamId?: string;
  timestamp: string;
}

export interface TeamUpdateMessage {
  teamId: string;
  action: 'MEMBER_ADDED' | 'MEMBER_REMOVED' | 'TEAM_UPDATED' | 'TEAM_DELETED';
  memberId?: string;
  memberName?: string;
  updatedBy: string;
  timestamp: string;
  details?: string;
}

export interface AdminNotificationMessage {
  id: string;
  title: string;
  message: string;
  action: 'USER_REGISTERED' | 'TEAM_CREATED' | 'SYSTEM_ALERT';
  userId?: string;
  teamId?: string;
  timestamp: string;
}

export type WebSocketConnectionState = 
  | 'NOT_INITIALIZED' 
  | 'CONNECTING' 
  | 'CONNECTED' 
  | 'DISCONNECTED' 
  | 'ERROR';

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
