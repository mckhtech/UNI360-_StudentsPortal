import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { AuthContextType, AuthState, User, LoginCredentials, SignUpCredentials } from '../types/auth';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  verifyUser, 
  googleLogin,
  refreshToken as refreshAuthToken 
} from '../services/auth.js';
import { 
  setTokens, 
  setUser, 
  getUser, 
  getToken, 
  getRefreshToken, 
  clearAuthData, 
  isAuthenticated as checkIsAuthenticated,
  isTokenExpired 
} from '../services/utils.js';

interface AuthAction {
  type: 'LOGIN_START' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'CLEAR_ERROR' | 'SET_LOADING' | 'UPDATE_USER' | 'RESTORE_SESSION';
  payload?: any;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Generate UUID function
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Auto-refresh token before expiration
  const setupTokenRefresh = useCallback(() => {
    const token = getToken();
    const refreshToken = getRefreshToken();
    
    if (!token || !refreshToken) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      
      const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
      
      if (refreshTime > 0) {
        const timeoutId = setTimeout(async () => {
          try {
            const newTokens = await refreshAuthToken(refreshToken);
            setTokens(newTokens.accessToken, newTokens.refreshToken);
            setupTokenRefresh();
          } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
          }
        }, refreshTime);

        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error setting up token refresh:', error);
    }
  }, [logout]);

  // Check for stored authentication on app load - IMPROVED PERSISTENCE
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const storedUser = getUser();
        const token = getToken();
        
        console.log('Initializing auth - stored user:', storedUser);
        console.log('Initializing auth - token exists:', !!token);
        
        if (storedUser && token) {
          // Check if token is expired
          if (isTokenExpired(token)) {
            console.log('Token expired, attempting refresh...');
            const refreshToken = getRefreshToken();
            
            if (refreshToken) {
              try {
                const newTokens = await refreshAuthToken(refreshToken);
                setTokens(newTokens.accessToken, newTokens.refreshToken);
                console.log('Token refreshed successfully');
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                clearAuthData();
                if (isMounted) {
                  dispatch({ type: 'LOGOUT' });
                }
                return;
              }
            } else {
              console.log('No refresh token available');
              clearAuthData();
              if (isMounted) {
                dispatch({ type: 'LOGOUT' });
              }
              return;
            }
          }
          
          // Restore session with stored user data
          if (isMounted) {
            console.log('Restoring session for user:', storedUser.name || storedUser.email);
            dispatch({ type: 'RESTORE_SESSION', payload: storedUser });
            setupTokenRefresh();
          }
          
        } else {
          console.log('No stored user data found');
          if (isMounted) {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
        if (isMounted) {
          dispatch({ type: 'LOGOUT' });
        }
      } finally {
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [setupTokenRefresh]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('Attempting login with credentials:', { email: credentials.email });
      
      const response = await loginUser(credentials);
      
      // Add UUID if not present
      const userWithUUID = {
        ...response.user,
        uuid: response.user.uuid || generateUUID()
      };
      
      console.log('Login response received:', userWithUUID);
      
      // Store tokens and user data
      setTokens(response.accessToken, response.refreshToken);
      setUser(userWithUUID);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithUUID });
      setupTokenRefresh();
      
      console.log('Login successful, user state updated');
    } catch (error: any) {
      console.error('Login failed:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  }, [setupTokenRefresh]);

  // Sign up function
  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('Attempting signup with credentials:', { 
        name: credentials.name, 
        email: credentials.email 
      });
      
      const response = await registerUser(credentials);
      
      // Add UUID if not present
      const userWithUUID = {
        ...response.user,
        uuid: response.user.uuid || generateUUID()
      };
      
      console.log('Signup response received:', userWithUUID);
      
      // Store tokens and user data
      setTokens(response.accessToken, response.refreshToken);
      setUser(userWithUUID);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithUUID });
      setupTokenRefresh();
      
      console.log('Signup successful, user state updated');
    } catch (error: any) {
      console.error('Sign up failed:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  }, [setupTokenRefresh]);

  // Google login function
  const loginWithGoogle = useCallback(async (googleToken: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('Attempting Google login');
      
      const response = await googleLogin(googleToken);
      
      // Add UUID if not present
      const userWithUUID = {
        ...response.user,
        uuid: response.user.uuid || generateUUID()
      };
      
      console.log('Google login response received:', userWithUUID);
      
      // Store tokens and user data
      setTokens(response.accessToken, response.refreshToken);
      setUser(userWithUUID);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithUUID });
      setupTokenRefresh();
      
      console.log('Google login successful, user state updated');
    } catch (error: any) {
      console.error('Google login failed:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  }, [setupTokenRefresh]);

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Password reset email would be sent to ${email}`);
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  }, []);

  // Update user profile function
  const updateUserProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      const currentUser = state.user;
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Update user in state
      const updatedUser = { ...currentUser, ...profileData };
      dispatch({ type: 'UPDATE_USER', payload: profileData });
      
      // Persist to localStorage
      setUser(updatedUser);
      
      console.log('Profile updated successfully:', updatedUser);
      
      return updatedUser;
    } catch (error: any) {
      console.error('Update profile error:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  }, [state.user]);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Memoize the context value
  const value: AuthContextType = useMemo(() => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    signUp,
    logout,
    resetPassword,
    clearError,
    loginWithGoogle,
    updateUserProfile,
  }), [
    state.user, 
    state.isAuthenticated, 
    state.isLoading, 
    state.error, 
    login, 
    signUp, 
    logout, 
    resetPassword, 
    clearError,
    loginWithGoogle,
    updateUserProfile
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};