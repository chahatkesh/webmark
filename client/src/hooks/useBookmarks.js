import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StoreContext } from "../context/StoreContext";
import { useContext } from 'react';

export const useCategories = () => {
  const { url } = useContext(StoreContext);
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${url}/api/bookmarks/categories`, {
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
  const { url } = useContext(StoreContext);
  return useQuery({
    queryKey: ['bookmarks', categoryId],
    queryFn: async () => {
      const res = await fetch(`${url}/api/bookmarks/bookmarks/${categoryId}`, {
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
  const { url } = useContext(StoreContext);

  return useMutation({
    mutationFn: async (categoryData) => {
      const res = await fetch(`${url}/api/bookmarks/category`, {
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
  const { url } = useContext(StoreContext);

  return useMutation({
    mutationFn: async (bookmarkData) => {
      const res = await fetch(`${url}/api/bookmarks/bookmark`, {
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

// delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { url } = useContext(StoreContext);

  return useMutation({
    mutationFn: async (categoryId) => {
      const res = await fetch(`${url}/api/bookmarks/category`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        },
        body: JSON.stringify({ categoryId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    }
  });
};
