import { gql } from '@apollo/client';

// ==================== AUTHENTICATION MUTATIONS ====================

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      userInfo {
        id
        email
        role
        firstName
        lastName
        fullName
        teamId
        courseId
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      userInfo {
        id
        email
        role
        firstName
        lastName
        fullName
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($token: String!) {
    logout(token: $token) {
      success
      message
    }
  }
`;

export const LOGOUT_ALL_DEVICES_MUTATION = gql`
  mutation LogoutAllDevices {
    logoutFromAllDevices {
      success
      message
      sessionsTerminated
    }
  }
`;

// ==================== USER QUERIES ====================

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      role
      firstName
      lastName
      fullName
      teamId
      courseId
      enabled
      accountNonExpired
      accountNonLocked
      credentialsNonExpired
    }
  }
`;

export const GET_USER_PERMISSIONS = gql`
  query GetUserPermissions {
    getUserPermissions {
      userId
      role
      permissions
      teamId
      courseId
      canManageTeam
      canManageCourse
      canViewAllTeams
      canSendNotifications
    }
  }
`;

// ==================== TEAM QUERIES ====================

export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($teamId: ID!) {
    getTeamMembers(teamId: $teamId) {
      id
      email
      firstName
      lastName
      fullName
      role
      teamId
      courseId
    }
  }
`;

export const GET_ALL_TEAMS = gql`
  query GetAllTeams {
    getAllTeams {
      teamId
      members {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

// ==================== COURSE QUERIES ====================

export const GET_COURSE_MEMBERS = gql`
  query GetCourseMembers($courseId: ID!) {
    getCourseMembers(courseId: $courseId) {
      id
      email
      firstName
      lastName
      fullName
      role
      teamId
      courseId
    }
  }
`;

