import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { apiRequest } from '../utils/apiClient';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data
  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    const deviceId = localStorage.getItem('device-id');

    try {
      const headers = {};
      if (deviceId) {
        headers['device-id'] = deviceId;
      }

      const data = await apiRequest('/api/user/profile', {
        method: 'POST',
        headers,
      });

      if (data.success) {
        if (data.profile?.currentDeviceId) {
          localStorage.setItem('device-id', data.profile.currentDeviceId);
        }

        setProfile(data.profile);
        setError(null);

        // Seed usage limits into localStorage so dashboard badges are accurate
        let limitsUpdated = false;
        if (data.profile.aiSortsRemaining !== undefined) {
          localStorage.setItem('aiSortsRemaining', String(data.profile.aiSortsRemaining));
          limitsUpdated = true;
        }
        if (data.profile.importsRemainingThisMonth !== undefined) {
          localStorage.setItem('importsRemainingThisMonth', String(data.profile.importsRemainingThisMonth));
          limitsUpdated = true;
        }
        if (limitsUpdated) {
          window.dispatchEvent(new Event('limitsUpdated'));
        }
      } else {
        setError(data.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.data?.message || 'Error fetching profile information');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      const data = await apiRequest('/api/user/profile', {
        method: 'PUT',
        body: updatedData,
      });

      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          ...data.profile,
        }));

        toast.success('Profile updated successfully');
        return true;
      }

      toast.error(data.message || 'Failed to update profile');
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.data?.message || 'Error updating profile information');
      return false;
    }
  };

  // Fetch profile data on hook initialization
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    profile,
    loading,
    error,
    fetchProfileData,
    updateProfile,
  };
};

export default useProfile;
