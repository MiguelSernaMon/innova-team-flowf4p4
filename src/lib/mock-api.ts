// Mock API para pruebas E2E con Serenity
// Todos los datos están hardcodeados para coincidir con los escenarios de las features

import type {
  Notification,
  NotificationStats,
  NotificationType,
  NotificationStatus,
  NotificationPermission,
  NotificationPermissionConfig,
  UpdatePermissionRequest,
} from './types';

// ==================== DATOS MOCK - USUARIOS ====================

// Usuarios con diferentes roles
const MOCK_USERS = {
  admin: {
    id: '1',
    name: 'Administrador',
    email: 'admin@udea.edu.co',
    role: 'ADMIN',
    avatar: '/placeholder.svg',
  },
  productOwner: {
    id: '2',
    name: 'Product Owner',
    email: 'po@udea.edu.co',
    role: 'PRODUCT_OWNER',
    avatar: '/placeholder.svg',
  },
  scrumMaster: {
    id: '3',
    name: 'Scrum Master',
    email: 'sm@udea.edu.co',
    role: 'SCRUM_MASTER',
    avatar: '/placeholder.svg',
  },
  tester: {
    id: '4',
    name: 'Tester',
    email: 'tester@udea.edu.co',
    role: 'TESTER',
    avatar: '/placeholder.svg',
  },
  developer: {
    id: '5',
    name: 'Developer',
    email: 'dev@udea.edu.co',
    role: 'DEVELOPER',
    avatar: '/placeholder.svg',
  },
  student: {
    id: '6',
    name: 'Usuario de Prueba',
    email: 'usuario@udea.edu.co',
    role: 'STUDENT',
    avatar: '/placeholder.svg',
  },
};

// Credenciales válidas (hardcodeadas) - ampliadas
const VALID_CREDENTIALS = {
  'usuario@udea.edu.co': { password: 'clave123', user: MOCK_USERS.student },
  'admin@udea.edu.co': { password: 'admin123', user: MOCK_USERS.admin },
  'po@udea.edu.co': { password: 'po123', user: MOCK_USERS.productOwner },
  'sm@udea.edu.co': { password: 'sm123', user: MOCK_USERS.scrumMaster },
  'tester@udea.edu.co': { password: 'test123', user: MOCK_USERS.tester },
  'dev@udea.edu.co': { password: 'dev123', user: MOCK_USERS.developer },
};

// ==================== DATOS MOCK - NOTIFICACIONES ====================

// Notificaciones hardcodeadas según los escenarios del feature
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Cambio de Rol',
    description: 'Tu rol ha sido actualizado en el sistema',
    type: 'alert',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Hace 30 minutos
    link: '/perfil/roles',
  },
  {
    id: '2',
    title: 'Nuevo integrante',
    description: 'Un nuevo miembro se ha unido a tu equipo',
    type: 'team',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Hace 1 hora
    link: '/equipo/miembros',
  },
  {
    id: '3',
    title: 'Bienvenido al equipo',
    description: 'Has sido agregado al equipo de desarrollo',
    type: 'admin',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // Hace 2 horas
    link: '/equipo/general',
  },
  {
    id: '4',
    title: 'Nueva tarea asignada',
    description: 'Se te ha asignado una nueva tarea en el proyecto',
    type: 'project',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Hace 1 día
    link: '/proyectos/tareas',
  },
  {
    id: '5',
    title: 'Reunión programada',
    description: 'Reunión de equipo programada para mañana a las 10:00 AM',
    type: 'team',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Hace 2 días
    link: '/calendario',
  },
];

// ==================== AUTH API MOCK ====================

export const mockAuthAPI = {
  /**
   * Login mock con validaciones hardcodeadas
   * Escenarios cubiertos:
   * - Credenciales válidas
   * - Credenciales inválidas
   * - Usuario no registrado
   * - Campo de correo vacío
   * - Campo de contraseña vacío
   */
  async login(email: string, password: string) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validación: campo de correo vacío
    if (!email || email.trim() === '') {
      throw new Error('El correo es obligatorio');
    }

    // Validación: campo de contraseña vacío
    if (!password || password.trim() === '') {
      throw new Error('La clave es obligatoria');
    }

    // Validación: usuario no registrado
    const credentials = VALID_CREDENTIALS[email as keyof typeof VALID_CREDENTIALS];
    if (!credentials) {
      throw new Error('Usuario no registrado');
    }

    // Validación: credenciales inválidas (email correcto pero password incorrecta)
    if (password !== credentials.password) {
      throw new Error('Credenciales inválidas');
    }

    // Login exitoso
    return {
      success: true,
      user: credentials.user,
      token: 'mock-token-' + Date.now(),
    };
  },

  async logout() {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');

    return { success: true };
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },
};

// ==================== NOTIFICATIONS API MOCK ====================

export const mockNotificationsAPI = {
  /**
   * Obtener notificaciones mock
   * Soporta filtrado por tipo y búsqueda
   */
  async getNotifications(params?: {
    type?: string;
    search?: string;
    status?: NotificationStatus;
  }) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));

    let filtered = [...MOCK_NOTIFICATIONS];

    // Filtrar por tipo
    if (params?.type && params.type !== 'all') {
      filtered = filtered.filter(n => n.type === params.type);
    }

    // Filtrar por estado
    if (params?.status) {
      filtered = filtered.filter(n => n.status === params.status);
    }

    // Filtrar por búsqueda
    if (params?.search && params.search.trim() !== '') {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(searchLower) ||
          n.description.toLowerCase().includes(searchLower)
      );
    }

    // Calcular estadísticas
    const stats: NotificationStats = {
      total: MOCK_NOTIFICATIONS.length,
      unread: MOCK_NOTIFICATIONS.filter(n => n.status === 'unread').length,
      read: MOCK_NOTIFICATIONS.filter(n => n.status === 'read').length,
    };

    return {
      success: true,
      notifications: filtered,
      stats,
    };
  },

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: string) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
    if (notification) {
      notification.status = 'read';
    }

    return { success: true };
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead() {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    MOCK_NOTIFICATIONS.forEach(n => {
      n.status = 'read';
    });

    return { success: true };
  },

  /**
   * Obtener notificación específica por ID
   */
  async getNotificationById(id: string) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    const notification = MOCK_NOTIFICATIONS.find(n => n.id === id);
    
    if (!notification) {
      throw new Error('Notificación no encontrada');
    }

    return {
      success: true,
      notification,
    };
  },
};

// ==================== MAPEO DE TIPOS PARA E2E ====================

/**
 * Mapeo de tipos de notificación según el feature de E2E
 * tipo -> { titulo, categoria, destino }
 */
export const NOTIFICATION_TYPE_MAPPING = {
  cambio_rol: {
    titulo: 'Cambio de Rol',
    categoria: 'alert',
    destino: '/perfil/roles',
  },
  nuevo_miembro: {
    titulo: 'Nuevo integrante',
    categoria: 'team',
    destino: '/equipo/miembros',
  },
  agregado_equipo: {
    titulo: 'Bienvenido al equipo',
    categoria: 'admin',
    destino: '/equipo/general',
  },
} as const;

/**
 * Obtener categoría visual según el tipo de notificación
 * Coincide con la columna "categoria" del feature de E2E
 */
export function getNotificationCategory(type: NotificationType): string {
  const categoryMap: Record<NotificationType, string> = {
    alert: 'Alerta',
    team: 'Equipo',
    admin: 'Info',
    project: 'Proyecto',
  };
  return categoryMap[type] || 'Info';
}

// ==================== NOTIFICATION PERMISSIONS API MOCK ====================

/**
 * Configuración de permisos de notificación por rol
 * Define qué roles pueden recibir qué tipos de notificaciones
 */
let NOTIFICATION_PERMISSIONS: NotificationPermission[] = [
  {
    roleId: 'ADMIN',
    roleName: 'Administrador',
    canReceive: ['alert', 'team', 'admin', 'project'],
    canSend: ['alert', 'team', 'admin', 'project'],
  },
  {
    roleId: 'PRODUCT_OWNER',
    roleName: 'Product Owner',
    canReceive: ['alert', 'team', 'project'],
    canSend: ['team', 'project'],
  },
  {
    roleId: 'SCRUM_MASTER',
    roleName: 'Scrum Master',
    canReceive: ['alert', 'team', 'project'],
    canSend: ['team', 'alert'],
  },
  {
    roleId: 'TESTER',
    roleName: 'Tester',
    canReceive: ['alert', 'project'],
    canSend: ['alert'],
  },
  {
    roleId: 'DEVELOPER',
    roleName: 'Developer',
    canReceive: ['alert', 'team', 'project'],
    canSend: ['alert'],
  },
  {
    roleId: 'STUDENT',
    roleName: 'Estudiante',
    canReceive: ['alert', 'team'],
    canSend: [],
  },
];

/**
 * Notificaciones con roles destino específicos
 */
interface NotificationWithRole extends Notification {
  targetRoles?: string[]; // Si está definido, solo estos roles pueden verla
}

const MOCK_NOTIFICATIONS_WITH_ROLES: NotificationWithRole[] = [
  {
    id: '1',
    title: 'Cambio de Rol',
    description: 'Tu rol ha sido actualizado en el sistema',
    type: 'alert',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: '/perfil/roles',
    targetRoles: undefined, // Todos pueden verla
  },
  {
    id: '2',
    title: 'Nuevo integrante',
    description: 'Un nuevo miembro se ha unido a tu equipo',
    type: 'team',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    link: '/equipo/miembros',
    targetRoles: undefined, // Todos pueden verla
  },
  {
    id: '3',
    title: 'Bienvenido al equipo',
    description: 'Has sido agregado al equipo de desarrollo',
    type: 'admin',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    link: '/equipo/general',
    targetRoles: ['ADMIN'], // Solo admin
  },
  {
    id: '4',
    title: 'Nueva tarea asignada',
    description: 'Se te ha asignado una nueva tarea en el proyecto',
    type: 'project',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: '/proyectos/tareas',
    targetRoles: ['PRODUCT_OWNER', 'DEVELOPER', 'TESTER'], // Solo estos roles
  },
  {
    id: '5',
    title: 'Reunión programada',
    description: 'Reunión de equipo programada para mañana a las 10:00 AM',
    type: 'team',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    link: '/calendario',
    targetRoles: ['SCRUM_MASTER', 'PRODUCT_OWNER'], // Solo estos roles
  },
  {
    id: '6',
    title: 'Notificación para Product Owner',
    description: 'Requiere tu aprobación para el siguiente sprint',
    type: 'project',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    link: '/sprints',
    targetRoles: ['PRODUCT_OWNER'], // Solo Product Owner
  },
  {
    id: '7',
    title: 'Notificación para Tester',
    description: 'Nuevos casos de prueba disponibles para revisión',
    type: 'alert',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    link: '/testing',
    targetRoles: ['TESTER'], // Solo Tester
  },
];

export const mockPermissionsAPI = {
  /**
   * Obtener la configuración de permisos actual
   */
  async getPermissionConfig(): Promise<NotificationPermissionConfig> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      permissions: NOTIFICATION_PERMISSIONS,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin@udea.edu.co',
    };
  },

  /**
   * Actualizar permisos para un rol específico
   * Solo permitido para usuarios con rol ADMIN
   */
  async updatePermissions(
    roleId: string,
    updates: UpdatePermissionRequest
  ): Promise<{ success: boolean; message: string }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));

    // Verificar que el usuario actual es admin
    const currentUser = mockAuthAPI.getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Solo los administradores pueden actualizar permisos');
    }

    // Buscar el rol
    const permission = NOTIFICATION_PERMISSIONS.find(p => p.roleId === roleId);
    if (!permission) {
      throw new Error('Rol no encontrado');
    }

    // Actualizar permisos
    if (updates.canReceive !== undefined) {
      permission.canReceive = updates.canReceive;
    }
    if (updates.canSend !== undefined) {
      permission.canSend = updates.canSend;
    }

    return {
      success: true,
      message: 'Configuración actualizada exitosamente',
    };
  },

  /**
   * Filtrar notificaciones según el rol del usuario
   */
  async getNotificationsForRole(
    userRole: string,
    params?: {
      type?: string;
      search?: string;
      status?: NotificationStatus;
    }
  ): Promise<{
    success: boolean;
    notifications: Notification[];
    stats: NotificationStats;
  }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));

    // Obtener permisos del rol
    const rolePermissions = NOTIFICATION_PERMISSIONS.find(
      p => p.roleId === userRole
    );

    if (!rolePermissions) {
      throw new Error('Rol no encontrado');
    }

    // Filtrar notificaciones:
    // 1. Por targetRoles (si está definido, el usuario debe estar en la lista)
    // 2. Por canReceive (el tipo de notificación debe estar permitido)
    let filtered = MOCK_NOTIFICATIONS_WITH_ROLES.filter(n => {
      // Si tiene targetRoles definido, verificar que el usuario está incluido
      if (n.targetRoles && n.targetRoles.length > 0) {
        if (!n.targetRoles.includes(userRole)) {
          return false;
        }
      }

      // Verificar que el rol puede recibir este tipo de notificación
      if (!rolePermissions.canReceive.includes(n.type)) {
        return false;
      }

      return true;
    });

    // Aplicar filtros adicionales
    if (params?.type && params.type !== 'all') {
      filtered = filtered.filter(n => n.type === params.type);
    }

    if (params?.status) {
      filtered = filtered.filter(n => n.status === params.status);
    }

    if (params?.search && params.search.trim() !== '') {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(searchLower) ||
          n.description.toLowerCase().includes(searchLower)
      );
    }

    // Calcular estadísticas (basadas en notificaciones filtradas)
    const stats: NotificationStats = {
      total: filtered.length,
      unread: filtered.filter(n => n.status === 'unread').length,
      read: filtered.filter(n => n.status === 'read').length,
    };

    return {
      success: true,
      notifications: filtered,
      stats,
    };
  },

  /**
   * Verificar si un usuario puede ver una notificación específica
   */
  canUserViewNotification(userRole: string, notificationId: string): boolean {
    const notification = MOCK_NOTIFICATIONS_WITH_ROLES.find(
      n => n.id === notificationId
    );

    if (!notification) {
      return false;
    }

    const rolePermissions = NOTIFICATION_PERMISSIONS.find(
      p => p.roleId === userRole
    );

    if (!rolePermissions) {
      return false;
    }

    // Verificar targetRoles
    if (notification.targetRoles && notification.targetRoles.length > 0) {
      if (!notification.targetRoles.includes(userRole)) {
        return false;
      }
    }

    // Verificar canReceive
    if (!rolePermissions.canReceive.includes(notification.type)) {
      return false;
    }

    return true;
  },
};

// ==================== EXPORT DEFAULT ====================

export default {
  auth: mockAuthAPI,
  notifications: mockNotificationsAPI,
  permissions: mockPermissionsAPI,
  getNotificationCategory,
  NOTIFICATION_TYPE_MAPPING,
};
