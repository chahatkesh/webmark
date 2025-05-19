import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from "../context/StoreContext";

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
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }

    try {
      const response = await axios.post(
        `${url}/api/user/userdata`,
        {},
        { headers: { token } }
      );

      // Check for new token in headers (token refresh)
      const newToken = response.headers['x-auth-token'];
      if (newToken) {
        localStorage.setItem('token', newToken);
      }

      if (response.data.success) {
        const userData = {
          username: response.data.username,
          email: response.data.email,
          name: response.data.name,
          profilePicture: response.data.profilePicture,
          joinedAt: response.data.joinedAt
        };

        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        // Handle onboarding required
        if (response.data.requiresOnboarding) {
          setIsAuthenticated(true); // They are authenticated but need to complete onboarding
          navigate('/onboarding');
          return true;
        }
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [url, setUser, navigate]);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          `${url}/api/user/logout`,
          {},
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth');
    }
  }, [navigate, setUser, url]);

  // For completing onboarding (setting username)
  const completeOnboarding = async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${url}/api/user/complete-onboarding`,
        { username },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchUserData();
        navigate('/user/dashboard');
        return { success: true };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Onboarding error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during onboarding'
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