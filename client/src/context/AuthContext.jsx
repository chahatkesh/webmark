import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate as globalMutate } from 'swr';
import { StoreContext } from './StoreContext';
import { apiRequest, clearLocalSession } from '../utils/apiClient';

const AuthContext = createContext(null);

const applyUserLimits = (data) => {
  let limitsUpdated = false;

  if (data.aiSortsRemaining !== undefined) {
    localStorage.setItem('aiSortsRemaining', String(data.aiSortsRemaining));
    limitsUpdated = true;
  }
  if (data.importsRemainingThisMonth !== undefined) {
    localStorage.setItem('importsRemainingThisMonth', String(data.importsRemainingThisMonth));
    limitsUpdated = true;
  }
  if (limitsUpdated) {
    window.dispatchEvent(new Event('limitsUpdated'));
  }
};

export const AuthProvider = ({ children }) => {
  const { url, setUser, user } = useContext(StoreContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const data = await apiRequest('/api/user/userdata', {
        method: 'POST',
      });

      if (data.success) {
        setUser({
          username: data.username,
          email: data.email,
          name: data.name,
          profilePicture: data.profilePicture,
          joinedAt: data.joinedAt,
        });
        applyUserLimits(data);
        setIsAuthenticated(true);
        return true;
      }

      if (data.requiresOnboarding) {
        setIsAuthenticated(true);
        navigate('/onboarding');
        return true;
      }

      throw new Error('Failed to fetch user data');
    } catch (error) {
      if (error.status !== 401 && !error.data?.requiresOnboarding) {
        console.error('Error fetching user data:', error);
      }
      if (error.data?.requiresOnboarding) {
        setIsAuthenticated(true);
        navigate('/onboarding');
        return true;
      }
      if (error.status === 401) {
        clearLocalSession();
      }
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setUser]);

  const googleLogin = useCallback(() => {
    window.location.href = `${url}/api/user/auth/google`;
  }, [url]);

  const logout = useCallback(async () => {
    try {
      await apiRequest('/api/user/logout', {
        method: 'POST',
        skipAuthRefresh: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearLocalSession();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth');
    }
  }, [navigate, setUser]);

  const completeOnboarding = useCallback(async (username) => {
    try {
      const data = await apiRequest('/api/user/complete-onboarding', {
        method: 'POST',
        body: { username },
      });

      if (data.success) {
        await fetchUserData();
        navigate('/user/dashboard');
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error('Onboarding error:', error);
      return {
        success: false,
        message: error.data?.message || 'An error occurred during onboarding',
      };
    }
  }, [fetchUserData, navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (!isAuthenticated) return;

    import('../pages/Dashboard');

    const categoriesKey = `${url}/api/bookmarks/categories`;
    globalMutate(
      categoriesKey,
      apiRequest(categoriesKey),
      { revalidate: false },
    ).catch((error) => {
      console.error('Failed to prefetch categories:', error);
    });
  }, [isAuthenticated, url]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      googleLogin,
      logout,
      completeOnboarding,
      fetchUserData,
    }),
    [isAuthenticated, isLoading, user, googleLogin, logout, completeOnboarding, fetchUserData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
