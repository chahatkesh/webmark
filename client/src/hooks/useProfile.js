import { useCallback, useContext } from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { StoreContext } from '../context/StoreContext';
import { apiRequest } from '../utils/apiClient';

const profileFetcher = async (url) => {
  const deviceId = localStorage.getItem('device-id');
  const headers = deviceId ? { 'device-id': deviceId } : {};

  const data = await apiRequest(url, {
    method: 'POST',
    headers,
  });

  if (data.profile?.currentDeviceId) {
    localStorage.setItem('device-id', data.profile.currentDeviceId);
  }

  if (data.success) {
    let limitsUpdated = false;
    if (data.profile?.aiSortsRemaining !== undefined) {
      localStorage.setItem('aiSortsRemaining', String(data.profile.aiSortsRemaining));
      limitsUpdated = true;
    }
    if (data.profile?.importsRemainingThisMonth !== undefined) {
      localStorage.setItem('importsRemainingThisMonth', String(data.profile.importsRemainingThisMonth));
      limitsUpdated = true;
    }
    if (limitsUpdated) {
      window.dispatchEvent(new Event('limitsUpdated'));
    }
  }

  return data;
};

export const useProfile = () => {
  const { url } = useContext(StoreContext);
  const profileKey = `${url}/api/user/profile`;

  const { data, error, isLoading, mutate } = useSWR(profileKey, profileFetcher, {
    dedupingInterval: 60 * 1000,
    revalidateOnFocus: false,
  });

  const fetchProfileData = useCallback(() => mutate(), [mutate]);

  const updateProfile = async (updatedData) => {
    try {
      const response = await apiRequest('/api/user/profile', {
        method: 'PUT',
        body: updatedData,
      });

      if (response.success) {
        mutate(
          (current) => ({
            ...current,
            profile: {
              ...current?.profile,
              ...response.profile,
            },
          }),
          { revalidate: false },
        );
        return true;
      }

      toast.error(response.message || 'Failed to update profile');
      return false;
    } catch (updateError) {
      console.error('Error updating profile:', updateError);
      toast.error(updateError.data?.message || 'Error updating profile information');
      return false;
    }
  };

  const formatTimeSaved = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return '0 minutes';

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    return `${days} day${days !== 1 ? 's' : ''} and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  };

  return {
    profile: data?.profile ?? null,
    clickStats: data?.clickStats ?? null,
    loading: isLoading,
    error: error?.data?.message || error?.message || (data && !data.success ? data.message : null),
    fetchProfileData,
    updateProfile,
    formatTimeSaved,
  };
};

export default useProfile;
