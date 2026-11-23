import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

function formatUserData(rawUser) {
  if (!rawUser) return null;
  const name = rawUser.fullName || rawUser.name || rawUser.username || 'User';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'IP';

  return {
    ...rawUser,
    name,
    fullName: rawUser.fullName || name,
    avatarInitials: rawUser.avatarInitials || initials,
    targetRole: rawUser.targetRole || 'Full Stack & Software Developer',
    experienceLevel: rawUser.experienceLevel || 'Entry Level (0-1 yrs)',
    college: rawUser.college || 'Apex Institute of Technology',
    degree: rawUser.degree || 'B.Tech in Computer Science & Engineering',
    graduationYear: rawUser.graduationYear || '2027',
    bio: rawUser.bio || 'Computer Science student passionate about technical interview preparation, algorithms, Java, Python, React, and building scalable modern web apps.',
    preferredTech: rawUser.preferredTech || ['Java', 'Python', 'JavaScript', 'React', 'SQL']
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('interviewprep_user');
      if (saved) return formatUserData(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to parse cached user:', e);
    }
    return null;
  });

  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount against Spring Boot backend
  useEffect(() => {
    let isMounted = true;
    async function verifySession() {
      const token = localStorage.getItem('token') || localStorage.getItem('interviewprep_jwt');
      if (token) {
        try {
          const profile = await authService.getCurrentUser();
          if (isMounted) {
            if (profile) {
              setUser(formatUserData(profile));
            } else {
              setUser(null);
            }
          }
        } catch (err) {
          if (isMounted) {
            setUser(null);
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
        }
      }
      if (isMounted) setIsLoading(false);
    }

    verifySession();
    return () => { isMounted = false; };
  }, []);

  // Sync to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('interviewprep_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('interviewprep_user');
    }
  }, [user]);

  const login = async (usernameOrEmail, password) => {
    setAuthError('');
    const cleanIdentifier = (usernameOrEmail || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanIdentifier || !cleanPassword) {
      const msg = 'Please provide both email/username and password.';
      setAuthError(msg);
      throw new Error(msg);
    }

    try {
      const res = await authService.login(cleanIdentifier, cleanPassword);
      if (res.user) {
        const formatted = formatUserData(res.user);
        setUser(formatted);
        return true;
      }
      return false;
    } catch (err) {
      const errMsg = err.message || 'Login failed. Please verify credentials.';
      setAuthError(errMsg);
      throw err;
    }
  };

  const loginAsDemo = async () => {
    setAuthError('');
    try {
      const res = await authService.login('demo@interviewprep.ai', 'DemoPass123!');
      if (res.user) {
        const formatted = formatUserData(res.user);
        setUser(formatted);
        return true;
      }
      return false;
    } catch (err) {
      const errMsg = err.message || 'Demo login failed. Verify backend and MySQL service.';
      setAuthError(errMsg);
      throw err;
    }
  };

  const signup = async ({ name, email, password, targetRole, experienceLevel, username }) => {
    setAuthError('');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();
    const cleanUsername = (username || cleanEmail.split('@')[0] || cleanName.toLowerCase().replace(/\s+/g, '')).trim();

    if (!cleanName || !cleanEmail || !password) {
      const msg = 'Please fill out all required fields.';
      setAuthError(msg);
      throw new Error(msg);
    }

    try {
      const res = await authService.register({
        username: cleanUsername,
        email: cleanEmail,
        password: password.trim(),
        fullName: cleanName
      });

      if (res.user) {
        const formatted = formatUserData({
          ...res.user,
          targetRole,
          experienceLevel
        });
        setUser(formatted);
        return true;
      }
      return false;
    } catch (err) {
      const errMsg = err.message || 'Registration failed. Please try a different email or username.';
      setAuthError(errMsg);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAuthError('');
  };

  const updateProfile = async (updatedFields) => {
    try {
      const res = await authService.updateProfile({
        fullName: updatedFields.fullName || updatedFields.name,
        email: updatedFields.email
      });
      setUser(prev => formatUserData({ ...prev, ...updatedFields, ...(res || {}) }));
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authError,
        setAuthError,
        login,
        loginAsDemo,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
