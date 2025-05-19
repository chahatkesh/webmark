import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';

export const useProfile = () => {
  const { url } = useContext(StoreContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data
  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const deviceId = localStorage.getItem('device-id');

    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    try {
      const headers = { token };
      if (deviceId) {
        headers['device-id'] = deviceId;
      }

      const response = await axios.post(
        `${url}/api/user/profile`,
        {},
        { headers }
      ); if (response.data.success) {
        // Log received profile data for debugging
        console.log("Profile data received:", response.data.profile);

        // Check if profile picture exists and is valid
        if (response.data.profile && response.data.profile.profilePicture) {
          console.log("Profile picture URL:", response.data.profile.profilePicture);
        } else {
          console.log("No profile picture in data");
        }

        // Store the device ID from the response data for consistency
        if (response.data.profile?.currentDeviceId) {
          console.log("Current device ID:", response.data.profile.currentDeviceId);
          localStorage.setItem('device-id', response.data.profile.currentDeviceId);
        } else if (response.headers['x-device-id']) {
          console.log("Device ID from headers:", response.headers['x-device-id']);
          localStorage.setItem('device-id', response.headers['x-device-id']);
        }

        setProfile(response.data.profile);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error fetching profile information');
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Update user profile
  const updateProfile = async (updatedData) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in to update profile');
      return false;
    }

    try {
      const response = await axios.put(
        `${url}/api/user/profile`,
        updatedData,
        { headers: { token } }
      );

      if (response.data.success) {
        // Update local profile state
        setProfile(prev => ({
          ...prev,
          ...response.data.profile
        }));

        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile information');
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
    updateProfile
  };
};

export default useProfile;
