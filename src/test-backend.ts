// Test script para verificar la conexión con el backend GraphQL
// Para ejecutar: npm run dev y abrir la consola del navegador

import { authAPI, teamsAPI, courseAPI } from './lib/api';

/**
 * Test 1: Login
 * Prueba el login con credenciales de estudiante
 */
export async function testLogin() {
  console.group('🔐 Test: Login');
  try {
    const result = await authAPI.login('estudiante@udea.edu.co', 'password123');
    console.log('✅ Login exitoso:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

/**
 * Test 2: Get Current User
 * Obtiene información del usuario autenticado
 */
export async function testGetCurrentUser() {
  console.group('👤 Test: Get Current User');
  try {
    const result = await authAPI.getCurrentUser();
    console.log('✅ Usuario actual:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

/**
 * Test 3: Get User Permissions
 * Obtiene los permisos del usuario
 */
export async function testGetUserPermissions() {
  console.group('🔑 Test: Get User Permissions');
  try {
    const result = await authAPI.getUserPermissions();
    console.log('✅ Permisos:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al obtener permisos:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

/**
 * Test 4: Get Team Members
 * Obtiene los miembros de un equipo
 */
export async function testGetTeamMembers(teamId: string = '1') {
  console.group(`👥 Test: Get Team Members (Team ${teamId})`);
  try {
    const result = await teamsAPI.getTeamMembers(teamId);
    console.log('✅ Miembros del equipo:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al obtener miembros:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

/**
 * Test 5: Get All Teams (Admin/Professor only)
 * Obtiene todos los equipos
 */
export async function testGetAllTeams() {
  console.group('🏢 Test: Get All Teams');
  try {
    const result = await teamsAPI.getAllTeams();
    console.log('✅ Todos los equipos:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al obtener equipos:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

/**
 * Test 6: Get Course Members (Professor/TA only)
 * Obtiene los miembros de un curso
 */
export async function testGetCourseMembers(courseId: string = 'CS101') {
  console.group(`📚 Test: Get Course Members (Course ${courseId})`);
  try {
    const result = await courseAPI.getCourseMembers(courseId);
    console.log('✅ Miembros del curso:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al obtener miembros del curso:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

/**
 * Test 7: Logout
 * Cierra sesión del usuario
 */
export async function testLogout() {
  console.group('👋 Test: Logout');
  try {
    const result = await authAPI.logout();
    console.log('✅ Logout exitoso:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en logout:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

/**
 * Suite de Tests Completa
 * Ejecuta todos los tests en secuencia
 */
export async function runAllTests() {
  console.log('🚀 Iniciando suite de tests del backend GraphQL\n');
  
  try {
    // Test 1: Login
    await testLogin();
    console.log('\n');
    
    // Test 2: Get Current User
    await testGetCurrentUser();
    console.log('\n');
    
    // Test 3: Get User Permissions
    const permissions = await testGetUserPermissions();
    console.log('\n');
    
    // Test 4: Get Team Members (si el usuario tiene equipo)
    if (permissions.permissions?.teamId) {
      await testGetTeamMembers(permissions.permissions.teamId);
      console.log('\n');
    }
    
    // Test 5: Get All Teams (solo si tiene permisos)
    if (permissions.permissions?.canViewAllTeams) {
      await testGetAllTeams();
      console.log('\n');
    }
    
    // Test 6: Get Course Members (solo si tiene permisos)
    if (permissions.permissions?.courseId && permissions.permissions?.canManageCourse) {
      await testGetCourseMembers(permissions.permissions.courseId);
      console.log('\n');
    }
    
    console.log('✅ Todos los tests completados exitosamente!\n');
    
    // Opcional: No hacer logout automáticamente para poder explorar
    // await testLogout();
    
  } catch (error) {
    console.error('\n❌ Suite de tests fallida:', error);
  }
}

// Exportar para uso en consola del navegador
if (typeof window !== 'undefined') {
  (window as any).backendTests = {
    runAll: runAllTests,
    login: testLogin,
    getCurrentUser: testGetCurrentUser,
    getPermissions: testGetUserPermissions,
    getTeamMembers: testGetTeamMembers,
    getAllTeams: testGetAllTeams,
    getCourseMembers: testGetCourseMembers,
    logout: testLogout,
  };
  
  console.log(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║        Backend GraphQL Tests disponibles en consola           ║
  ╠═══════════════════════════════════════════════════════════════╣
  ║                                                               ║
  ║  Ejecuta en la consola:                                       ║
  ║                                                               ║
  ║  • backendTests.runAll()           - Ejecutar todos           ║
  ║  • backendTests.login()            - Test de login            ║
  ║  • backendTests.getCurrentUser()   - Usuario actual           ║
  ║  • backendTests.getPermissions()   - Permisos                 ║
  ║  • backendTests.getTeamMembers()   - Miembros del equipo      ║
  ║  • backendTests.getAllTeams()      - Todos los equipos        ║
  ║  • backendTests.getCourseMembers() - Miembros del curso       ║
  ║  • backendTests.logout()           - Cerrar sesión            ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝
  `);
}
