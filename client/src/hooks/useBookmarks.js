import { useContext, useCallback, useState } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

// ── Shared fetcher ─────────────────────────────────────────────────────────────
const authFetcher = async (url) => {
  const res = await fetch(url, {
    headers: { token: localStorage.getItem('token') },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

// ── Category cache key helper ─────────────────────────────────────────────────
// All bookmark mutations patch the categories cache directly because the
// /categories endpoint already embeds bookmarks inside each category.
const catKey = (url) => `${url}/api/bookmarks/categories`;

// Optimistically update the categories SWR cache, returns the previous snapshot
function updateCatCache(url, updater) {
  let previous;
  globalMutate(
    catKey(url),
    (current) => {
      previous = current;
      return updater(current);
    },
    { revalidate: false },
  );
  return () => globalMutate(catKey(url), previous, { revalidate: false });
}

// ── Helper: wraps useSWRMutation to expose the React-Query-like API ──────────
function useMutationAction(key, action) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { trigger, isMutating, reset: swrReset } = useSWRMutation(key, action, {
    throwOnError: false,
    onSuccess: (result) => setData(result),
    onError: (err) => setError(err),
  });

  const mutate = useCallback((arg) => { trigger(arg); }, [trigger]);
  const mutateAsync = useCallback((arg) => trigger(arg), [trigger]);
  const reset = useCallback(() => {
    swrReset();
    setData(null);
    setError(null);
  }, [swrReset]);

  return { mutate, mutateAsync, isPending: isMutating, data, error, reset };
}

// ── Queries ────────────────────────────────────────────────────────────────────

export const useCategories = (includeBookmarks = false) => {
  const { url } = useContext(StoreContext);
  const endpoint = includeBookmarks
    ? '/api/bookmarks/categories-with-bookmarks'
    : '/api/bookmarks/categories';

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `${url}${endpoint}`,
    authFetcher,
    {
      dedupingInterval: 2 * 60 * 1000,
      revalidateOnFocus: false,
      onError: () => toast.error('Failed to fetch categories'),
    },
  );

  return { data: data?.categories, error, isLoading, isValidating, mutate };
};

export const useBookmarks = (categoryId) => {
  const { url } = useContext(StoreContext);

  const { data, error, isLoading } = useSWR(
    categoryId ? `${url}/api/bookmarks/bookmarks/${categoryId}` : null,
    authFetcher,
    { dedupingInterval: 2 * 60 * 1000, revalidateOnFocus: false },
  );

  return { data: data?.bookmarks, error, isLoading };
};

// ── Category mutations ─────────────────────────────────────────────────────────

export const useCreateCategory = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('create-category', async (_, { arg: categoryData }) => {
    const res = await fetch(`${url}/api/bookmarks/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!data.success) { toast.error('Failed to create category'); throw new Error(data.message); }

    const newCat = data.category;
    // Inject new category into cache immediately — no second fetch needed
    globalMutate(catKey(url), (current) => {
      if (!current?.categories) return current;
      return { ...current, categories: [...current.categories, { ...newCat, bookmarks: [] }] };
    }, { revalidate: false });

    toast.success('Category created successfully');
    return newCat;
  });
};

export const useUpdateCategory = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('update-category', async (_, { arg: categoryData }) => {
    // Optimistic update
    const rollback = updateCatCache(url, (current) => {
      if (!current?.categories) return current;
      return {
        ...current,
        categories: current.categories.map((c) =>
          c._id === categoryData.categoryId ? { ...c, ...categoryData } : c,
        ),
      };
    });

    try {
      const res = await fetch(`${url}/api/bookmarks/category`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
        body: JSON.stringify(categoryData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Confirm with server data
      globalMutate(catKey(url), (current) => {
        if (!current?.categories) return current;
        return {
          ...current,
          categories: current.categories.map((c) =>
            c._id === categoryData.categoryId ? { ...c, ...data.category } : c,
          ),
        };
      }, { revalidate: false });

      toast.success('Category updated successfully');
      return data.category;
    } catch (err) {
      rollback();
      toast.error('Failed to update category');
      throw err;
    }
  });
};

export const useDeleteCategory = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('delete-category', async (_, { arg: categoryId }) => {
    // Optimistic removal
    const rollback = updateCatCache(url, (current) => {
      if (!current?.categories) return current;
      return { ...current, categories: current.categories.filter((c) => c._id !== categoryId) };
    });

    try {
      const res = await fetch(`${url}/api/bookmarks/category`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
        body: JSON.stringify({ categoryId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success('Category deleted successfully');
      return data;
    } catch (err) {
      rollback();
      toast.error('Failed to delete category');
      throw err;
    }
  });
};

// ── Bookmark mutations ─────────────────────────────────────────────────────────

export const useCreateBookmark = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('create-bookmark', async (_, { arg: bookmarkData }) => {
    const res = await fetch(`${url}/api/bookmarks/bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
      body: JSON.stringify(bookmarkData),
    });
    const data = await res.json();
    if (!data.success) { toast.error('Failed to create bookmark'); throw new Error(data.message); }

    const newBookmark = data.bookmark;
    // Insert into category in the cache immediately
    globalMutate(catKey(url), (current) => {
      if (!current?.categories) return current;
      return {
        ...current,
        categories: current.categories.map((c) =>
          c._id === bookmarkData.categoryId
            ? { ...c, bookmarks: [...(c.bookmarks || []), newBookmark] }
            : c,
        ),
      };
    }, { revalidate: false });

    toast.success('Bookmark created successfully');
    return newBookmark;
  });
};

export const useUpdateBookmark = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('update-bookmark', async (_, { arg: bookmarkData }) => {
    // Optimistic update
    const rollback = updateCatCache(url, (current) => {
      if (!current?.categories) return current;
      return {
        ...current,
        categories: current.categories.map((c) => ({
          ...c,
          bookmarks: (c.bookmarks || []).map((b) =>
            b._id === bookmarkData.bookmarkId ? { ...b, ...bookmarkData } : b,
          ),
        })),
      };
    });

    try {
      const res = await fetch(`${url}/api/bookmarks/bookmark`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
        body: JSON.stringify(bookmarkData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Replace optimistic entry with real server data
      const updated = data.bookmark;
      globalMutate(catKey(url), (current) => {
        if (!current?.categories) return current;
        return {
          ...current,
          categories: current.categories.map((c) => ({
            ...c,
            bookmarks: (c.bookmarks || []).map((b) =>
              b._id === updated._id ? updated : b,
            ),
          })),
        };
      }, { revalidate: false });

      toast.success('Bookmark updated successfully');
      return updated;
    } catch (err) {
      rollback();
      toast.error('Failed to update bookmark');
      throw err;
    }
  });
};

export const useDeleteBookmark = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('delete-bookmark', async (_, { arg: { bookmarkId, categoryId } }) => {
    // Optimistic removal — UI updates instantly
    const rollback = updateCatCache(url, (current) => {
      if (!current?.categories) return current;
      return {
        ...current,
        categories: current.categories.map((c) =>
          c._id === categoryId
            ? { ...c, bookmarks: (c.bookmarks || []).filter((b) => b._id !== bookmarkId) }
            : c,
        ),
      };
    });

    try {
      const res = await fetch(`${url}/api/bookmarks/bookmark`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
        body: JSON.stringify({ bookmarkId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success('Bookmark deleted successfully');
      return { bookmarkId, categoryId };
    } catch (err) {
      rollback();
      toast.error('Failed to delete bookmark');
      throw err;
    }
  });
};

export const useUpdateBookmarkOrder = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('reorder-bookmarks', async (_, { arg: { categoryId, bookmarks } }) => {
    // Optimistic reorder in the categories cache
    const rollback = updateCatCache(url, (current) => {
      if (!current?.categories) return current;
      return {
        ...current,
        categories: current.categories.map((c) => {
          if (c._id !== categoryId) return c;
          const bookmarkMap = (c.bookmarks || []).reduce((acc, b) => {
            acc[b._id] = b;
            return acc;
          }, {});
          return {
            ...c,
            bookmarks: bookmarks
              .map(({ id, order }) => ({ ...bookmarkMap[id], order }))
              .sort((a, b) => a.order - b.order),
          };
        }),
      };
    });

    try {
      const res = await fetch(`${url}/api/bookmarks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
        body: JSON.stringify({ categoryId, bookmarks }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (err) {
      rollback();
      toast.error('Failed to update bookmark order');
      throw err;
    }
  });
};

// ── Import / AI ────────────────────────────────────────────────────────────────

export const useImportBookmarks = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('import-bookmarks', async (_, { arg: folders }) => {
    const res = await fetch(`${url}/api/bookmarks/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
      body: JSON.stringify({ folders }),
    });
    const data = await res.json();
    if (!data.success) { toast.error(data.message || 'Import failed. Please try again.'); throw new Error(data.message); }

    // Full revalidation — import restructures everything
    globalMutate(catKey(url));
    const { results, importBonusGranted, aiSortsRemaining, importsRemainingThisMonth } = data;
    toast.success(
      `Imported ${results.bookmarksCreated} bookmark${results.bookmarksCreated !== 1 ? 's' : ''} across ${results.categoriesCreated} new categor${results.categoriesCreated !== 1 ? 'ies' : 'y'}`,
    );
    if (importBonusGranted) toast.info('🎁 Import bonus: +1 AI Sort credit added!');
    if (aiSortsRemaining != null) localStorage.setItem('aiSortsRemaining', String(aiSortsRemaining));
    if (importsRemainingThisMonth !== undefined) localStorage.setItem('importsRemainingThisMonth', String(importsRemainingThisMonth));
    return data;
  });
};

export const useAISort = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('ai-sort', async () => {
    const res = await fetch(`${url}/api/bookmarks/ai/sort`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
    });
    const data = await res.json();
    if (!data.success) {
      if (data.aiSortsRemaining !== undefined) localStorage.setItem('aiSortsRemaining', String(data.aiSortsRemaining));
      throw new Error(data.message);
    }
    // Full revalidation — AI sort restructures everything
    globalMutate(catKey(url));
    const results = data.results;
    if (results?.aiSortsRemaining !== undefined) localStorage.setItem('aiSortsRemaining', String(results.aiSortsRemaining));
    if (results?.canRevert) localStorage.setItem('canRevertAISort', 'true');
    return results;
  });
};

export const useRevertAISort = () => {
  const { url } = useContext(StoreContext);

  return useMutationAction('revert-ai-sort', async () => {
    const res = await fetch(`${url}/api/bookmarks/ai/sort/revert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    globalMutate(catKey(url));
    localStorage.removeItem('canRevertAISort');
    toast.success('AI Sort reverted successfully');
    return data;
  });
};
