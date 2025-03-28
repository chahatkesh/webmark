import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from "../context/StoreContext";

export const useAuth = () => {
  const { url, setUser } = useContext(StoreContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

      if (response.data.success) {
        const userData = {
          username: response.data.username,
          email: response.data.email,
          joinedAt: response.data.joinedAt
        };

        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        // Handle verification required
        if (response.data.requiresVerification) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          navigate('/auth', {
            state: {
              requiresVerification: true,
              email: response.data.email
            }
          });
          return false;
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

  const login = async (formData) => {
    try {
      const response = await axios.post(`${url}/api/user/login`, formData);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        await fetchUserData();
        return { success: true };
      }

      // Handle verification required
      if (response.data.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: response.data.email,
          message: response.data.message
        };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during login'
      };
    }
  };

  const signup = async (formData) => {
    try {
      const response = await axios.post(`${url}/api/user/register`, formData);

      if (response.data.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: formData.email,
          message: "Please verify your email to continue"
        };
      }

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        await fetchUserData();
        return { success: true };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during registration'
      };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/auth');
  }, [navigate, setUser]);

  // Check auth status when the hook is initialized
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    fetchUserData,
    user: useContext(StoreContext).user
  };
};