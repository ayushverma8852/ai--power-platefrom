import api from './api';

export const authService = {
  /**
   * Log in user with credentials directly via Spring Boot backend
   */
  async login(usernameOrEmail, password) {
    const response = await api.post('/api/auth/login', {
      usernameOrEmail,
      password
    });

    const { accessToken, user } = response.data;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('interviewprep_jwt', accessToken);
    }
    if (user) {
      localStorage.setItem('interviewprep_user', JSON.stringify(user));
    }
    return { success: true, user, token: accessToken, source: 'backend' };
  },

  /**
   * Register new user account directly via Spring Boot backend
   */
  async register({ username, email, password, fullName }) {
    const response = await api.post('/api/auth/register', {
      username: username || (email ? email.split('@')[0] : ''),
      email,
      password,
      fullName
    });

    const { accessToken, user } = response.data;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('interviewprep_jwt', accessToken);
    }
    if (user) {
      localStorage.setItem('interviewprep_user', JSON.stringify(user));
    }
    return { success: true, user, token: accessToken, source: 'backend' };
  },

  /**
   * Get current authenticated user profile from Spring Boot backend
   */
  async getCurrentUser() {
    const token = localStorage.getItem('token') || localStorage.getItem('interviewprep_jwt');
    if (!token) return null;

    try {
      const response = await api.get('/api/auth/me');
      if (response.data) {
        localStorage.setItem('interviewprep_user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.warn('[authService] Failed to fetch current user profile:', error.message);
      // If unauthorized, clear stale credentials
      localStorage.removeItem('token');
      localStorage.removeItem('interviewprep_jwt');
      localStorage.removeItem('interviewprep_user');
      return null;
    }
    return null;
  },

  /**
   * Update user profile information directly via Spring Boot backend
   */
  async updateProfile({ fullName, email }) {
    const response = await api.put('/api/auth/profile', { fullName, email });
    if (response.data) {
      localStorage.setItem('interviewprep_user', JSON.stringify(response.data));
      return response.data;
    }
    return null;
  },

  /**
   * Log out user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('interviewprep_jwt');
    localStorage.removeItem('interviewprep_user');
    return { success: true };
  }
};

export default authService;
