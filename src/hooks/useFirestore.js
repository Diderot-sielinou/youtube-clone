import { useState, useCallback } from "react";
import {
  addToHistory,
  getHistory,
  clearHistory,
  removeFromHistory,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isVideoFavorite,
  addToWatchLater,
  removeFromWatchLater,
  getWatchLater,
  isVideoInWatchLater,
  addSearchQuery,
  getSearchHistory,
  clearSearchHistory,
  toggleVideoLike,
  getVideoLikes,
  addComment,
  getVideoComments,
  toggleCommentLike,
  getMostWatchedCategory,
} from "../services/firestoreService";
import toast from "react-hot-toast";

export const useFirestore = (userId) => {
  const [loading, setLoading] = useState(false);

  // ============================================
  // HISTORY OPERATIONS
  // ============================================

  const saveToHistory = useCallback(
    async (videoData) => {
      if (!userId) return;
      await addToHistory(userId, videoData);
    },
    [userId]
  );

  const fetchHistory = useCallback(async () => {
    if (!userId) return [];
    setLoading(true);
    const history = await getHistory(userId);
    setLoading(false);
    return history;
  }, [userId]);

  const deleteHistory = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const result = await clearHistory(userId);
    if (result.success) {
      toast.success("History cleared");
    }
    setLoading(false);
    return result;
  }, [userId]);

  const deleteFromHistory = useCallback(
    async (videoId) => {
      if (!userId) return;
      const result = await removeFromHistory(userId, videoId);
      if (result.success) {
        toast.success("Removed from history");
      }
      return result;
    },
    [userId]
  );

  // ============================================
  // FAVORITES OPERATIONS
  // ============================================

  const saveFavorite = useCallback(
    async (videoData) => {
      if (!userId) {
        toast.error("Please sign in to add favorites");
        return { success: false };
      }
      setLoading(true);
      const result = await addToFavorites(userId, videoData);
      if (result.success) {
        toast.success("Added to favorites");
      }
      setLoading(false);
      return result;
    },
    [userId]
  );

  const removeFavorite = useCallback(
    async (videoId) => {
      if (!userId) return;
      const result = await removeFromFavorites(userId, videoId);
      if (result.success) {
        toast.success("Removed from favorites");
      }
      return result;
    },
    [userId]
  );

  const fetchFavorites = useCallback(async () => {
    if (!userId) return [];
    setLoading(true);
    const favorites = await getFavorites(userId);
    setLoading(false);
    return favorites;
  }, [userId]);

  const checkIsFavorite = useCallback(
    async (videoId) => {
      if (!userId) return false;
      return await isVideoFavorite(userId, videoId);
    },
    [userId]
  );

  // ============================================
  // WATCH LATER OPERATIONS
  // ============================================

  const saveToWatchLater = useCallback(
    async (videoData) => {
      if (!userId) {
        toast.error("Please sign in to save videos");
        return { success: false };
      }
      setLoading(true);
      const result = await addToWatchLater(userId, videoData);
      if (result.success) {
        toast.success("Added to Watch Later");
      }
      setLoading(false);
      return result;
    },
    [userId]
  );

  const removeWatchLater = useCallback(
    async (videoId) => {
      if (!userId) return;
      const result = await removeFromWatchLater(userId, videoId);
      if (result.success) {
        toast.success("Removed from Watch Later");
      }
      return result;
    },
    [userId]
  );

  const fetchWatchLater = useCallback(async () => {
    if (!userId) return [];
    setLoading(true);
    const watchLater = await getWatchLater(userId);
    setLoading(false);
    return watchLater;
  }, [userId]);

  const checkIsWatchLater = useCallback(
    async (videoId) => {
      if (!userId) return false;
      return await isVideoInWatchLater(userId, videoId);
    },
    [userId]
  );

  // ============================================
  // SEARCH HISTORY OPERATIONS
  // ============================================

  const saveSearchQuery = useCallback(
    async (query) => {
      if (!userId) return;
      await addSearchQuery(userId, query);
    },
    [userId]
  );

  const fetchSearchHistory = useCallback(async () => {
    if (!userId) return [];
    return await getSearchHistory(userId);
  }, [userId]);

  const deleteSearchHistory = useCallback(async () => {
    if (!userId) return;
    const result = await clearSearchHistory(userId);
    if (result.success) {
      toast.success("Search history cleared");
    }
    return result;
  }, [userId]);

  // ============================================
  // LIKES OPERATIONS
  // ============================================

  const likeVideo = useCallback(
    async (videoId) => {
      if (!userId) {
        toast.error("Please sign in to like videos");
        return { success: false };
      }
      return await toggleVideoLike(userId, videoId);
    },
    [userId]
  );

  const fetchVideoLikes = useCallback(
    async (videoId) => {
      return await getVideoLikes(videoId, userId);
    },
    [userId]
  );

  // ============================================
  // COMMENTS OPERATIONS
  // ============================================

  const postComment = useCallback(
    async (videoId, text, userData) => {
      if (!userId) {
        toast.error("Please sign in to comment");
        return { success: false };
      }
      const result = await addComment(userId, videoId, text, userData);
      if (result.success) {
        toast.success("Comment posted");
      }
      return result;
    },
    [userId]
  );

  const fetchComments = useCallback(async (videoId) => {
    return await getVideoComments(videoId);
  }, []);

  const likeComment = useCallback(
    async (videoId, commentId) => {
      if (!userId) {
        toast.error("Please sign in to like comments");
        return { success: false };
      }
      return await toggleCommentLike(userId, videoId, commentId);
    },
    [userId]
  );

  // ============================================
  // PREFERENCES
  // ============================================

  const getRecommendedCategory = useCallback(async () => {
    if (!userId) return "New";
    return await getMostWatchedCategory(userId);
  }, [userId]);

  return {
    loading,
    // History
    saveToHistory,
    fetchHistory,
    deleteHistory,
    deleteFromHistory,
    // Favorites
    saveFavorite,
    removeFavorite,
    fetchFavorites,
    checkIsFavorite,
    // Watch Later
    saveToWatchLater,
    removeWatchLater,
    fetchWatchLater,
    checkIsWatchLater,
    // Search
    saveSearchQuery,
    fetchSearchHistory,
    deleteSearchHistory,
    // Likes
    likeVideo,
    fetchVideoLikes,
    // Comments
    postComment,
    fetchComments,
    likeComment,
    // Preferences
    getRecommendedCategory,
  };
};

export default useFirestore;
