import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/user/userdata', {
        method: 'POST',
        headers: {
          token: token
        }
      });
      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUserData(data);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
    }
    setIsLoading(false);
  };

  return { isAuthenticated, isLoading, userData };
};
