import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:4000/api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/bookmarks/categories`, {
        headers: {
          token: localStorage.getItem('token')
        }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.categories;
    }
  });
};

export const useBookmarks = (categoryId) => {
  return useQuery({
    queryKey: ['bookmarks', categoryId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/bookmarks/bookmarks/${categoryId}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.bookmarks;
    },
    enabled: !!categoryId
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData) => {
      const res = await fetch(`${API_URL}/bookmarks/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        },
        body: JSON.stringify(categoryData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    }
  });
};

export const useCreateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkData) => {
      const res = await fetch(`${API_URL}/bookmarks/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        },
        body: JSON.stringify(bookmarkData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.bookmark;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['bookmarks', variables.categoryId]);
    }
  });
};
