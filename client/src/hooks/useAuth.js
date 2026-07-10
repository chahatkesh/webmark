import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from "../context/StoreContext";
import { apiRequest, clearLocalSession } from '../utils/apiClient';

export const useAuth = () => {
  const { url, setUser } = useContext(StoreContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initiate Google Authentication
  const googleLogin = useCallback(() => {
    window.location.href = `${url}/api/user/auth/google`;
  }, [url]);

  const fetchUserData = useCallback(async () => {
    try {
      const data = await apiRequest('/api/user/userdata', {
        method: 'POST',
      });

      if (data.success) {
        const userData = {
          username: data.username,
          email: data.email,
          name: data.name,
          profilePicture: data.profilePicture,
          joinedAt: data.joinedAt
        };

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

        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        // Handle onboarding required
        if (data.requiresOnboarding) {
          setIsAuthenticated(true); // They are authenticated but need to complete onboarding
          navigate('/onboarding');
          return true;
        }
        throw new Error('Failed to fetch user data');
      }
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
  }, [setUser, navigate]);

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

  // For completing onboarding (setting username)
  const completeOnboarding = async (username) => {
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
        message: error.data?.message || 'An error occurred during onboarding'
      };
    }
  };

  // Check auth status when the hook is initialized
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    isAuthenticated,
    isLoading,
    googleLogin,
    completeOnboarding,
    logout,
    fetchUserData,
    user: useContext(StoreContext).user
  };
};
