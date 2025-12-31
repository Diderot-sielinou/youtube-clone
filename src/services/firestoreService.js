import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

// ============================================
// WATCH HISTORY
// ============================================

// Add video to watch history
export const addToHistory = async (userId, videoData) => {
  if (!userId || !videoData?.videoId) return { success: false };

  try {
    const historyRef = doc(db, "users", userId, "history", videoData.videoId);

    await setDoc(historyRef, {
      videoId: videoData.videoId,
      title: videoData.title || "",
      thumbnail: videoData.thumbnails?.[0]?.url || "",
      channelTitle: videoData.author?.title || "",
      channelAvatar: videoData.author?.avatar?.[0]?.url || "",
      duration: videoData.lengthSeconds || 0,
      views: videoData.stats?.views || 0,
      watchedAt: serverTimestamp(),
      watchCount: increment(1),
    });

    // Update user's category preferences based on video
    await updateCategoryPreference(userId, videoData.category);

    return { success: true };
  } catch (error) {
    console.error("Error adding to history:", error);
    return { success: false, error: error.message };
  }
};

// Get watch history
export const getHistory = async (userId, limitCount = 50) => {
  if (!userId) return [];

  try {
    const historyRef = collection(db, "users", userId, "history");
    const q = query(historyRef, orderBy("watchedAt", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting history:", error);
    return [];
  }
};

// Clear watch history
export const clearHistory = async (userId) => {
  if (!userId) return { success: false };

  try {
    const historyRef = collection(db, "users", userId, "history");
    const snapshot = await getDocs(historyRef);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error) {
    console.error("Error clearing history:", error);
    return { success: false, error: error.message };
  }
};

// Remove single video from history
export const removeFromHistory = async (userId, videoId) => {
  if (!userId || !videoId) return { success: false };

  try {
    const historyRef = doc(db, "users", userId, "history", videoId);
    await deleteDoc(historyRef);
    return { success: true };
  } catch (error) {
    console.error("Error removing from history:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FAVORITES / LIKED VIDEOS
// ============================================

// Add to favorites
export const addToFavorites = async (userId, videoData) => {
  if (!userId || !videoData?.videoId) return { success: false };

  try {
    const favRef = doc(db, "users", userId, "favorites", videoData.videoId);

    await setDoc(favRef, {
      videoId: videoData.videoId,
      title: videoData.title || "",
      thumbnail: videoData.thumbnails?.[0]?.url || "",
      channelTitle: videoData.author?.title || "",
      channelAvatar: videoData.author?.avatar?.[0]?.url || "",
      duration: videoData.lengthSeconds || 0,
      views: videoData.stats?.views || 0,
      addedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return { success: false, error: error.message };
  }
};

// Remove from favorites
export const removeFromFavorites = async (userId, videoId) => {
  if (!userId || !videoId) return { success: false };

  try {
    const favRef = doc(db, "users", userId, "favorites", videoId);
    await deleteDoc(favRef);
    return { success: true };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return { success: false, error: error.message };
  }
};

// Get favorites
export const getFavorites = async (userId, limitCount = 50) => {
  if (!userId) return [];

  try {
    const favRef = collection(db, "users", userId, "favorites");
    const q = query(favRef, orderBy("addedAt", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

// Check if video is in favorites
export const isVideoFavorite = async (userId, videoId) => {
  if (!userId || !videoId) return false;

  try {
    const favRef = doc(db, "users", userId, "favorites", videoId);
    const snap = await getDoc(favRef);
    return snap.exists();
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
};

// ============================================
// WATCH LATER
// ============================================

// Add to watch later
export const addToWatchLater = async (userId, videoData) => {
  if (!userId || !videoData?.videoId) return { success: false };

  try {
    const watchLaterRef = doc(db, "users", userId, "watchLater", videoData.videoId);

    await setDoc(watchLaterRef, {
      videoId: videoData.videoId,
      title: videoData.title || "",
      thumbnail: videoData.thumbnails?.[0]?.url || "",
      channelTitle: videoData.author?.title || "",
      channelAvatar: videoData.author?.avatar?.[0]?.url || "",
      duration: videoData.lengthSeconds || 0,
      views: videoData.stats?.views || 0,
      publishedTimeText: videoData.publishedTimeText || "",
      addedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding to watch later:", error);
    return { success: false, error: error.message };
  }
};

// Remove from watch later
export const removeFromWatchLater = async (userId, videoId) => {
  if (!userId || !videoId) return { success: false };

  try {
    const watchLaterRef = doc(db, "users", userId, "watchLater", videoId);
    await deleteDoc(watchLaterRef);
    return { success: true };
  } catch (error) {
    console.error("Error removing from watch later:", error);
    return { success: false, error: error.message };
  }
};

// Get watch later list
export const getWatchLater = async (userId, limitCount = 50) => {
  if (!userId) return [];

  try {
    const watchLaterRef = collection(db, "users", userId, "watchLater");
    const q = query(watchLaterRef, orderBy("addedAt", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting watch later:", error);
    return [];
  }
};

// Check if video is in watch later
export const isVideoInWatchLater = async (userId, videoId) => {
  if (!userId || !videoId) return false;

  try {
    const watchLaterRef = doc(db, "users", userId, "watchLater", videoId);
    const snap = await getDoc(watchLaterRef);
    return snap.exists();
  } catch (error) {
    console.error("Error checking watch later:", error);
    return false;
  }
};

// ============================================
// SEARCH HISTORY
// ============================================

// Add search query to history
export const addSearchQuery = async (userId, searchQuery) => {
  if (!userId || !searchQuery?.trim()) return { success: false };

  try {
    const searchRef = doc(db, "users", userId, "searchHistory", searchQuery.toLowerCase().trim());

    await setDoc(searchRef, {
      query: searchQuery.trim(),
      searchedAt: serverTimestamp(),
      searchCount: increment(1),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding search query:", error);
    return { success: false, error: error.message };
  }
};

// Get search history
export const getSearchHistory = async (userId, limitCount = 10) => {
  if (!userId) return [];

  try {
    const searchRef = collection(db, "users", userId, "searchHistory");
    const q = query(searchRef, orderBy("searchedAt", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data().query);
  } catch (error) {
    console.error("Error getting search history:", error);
    return [];
  }
};

// Clear search history
export const clearSearchHistory = async (userId) => {
  if (!userId) return { success: false };

  try {
    const searchRef = collection(db, "users", userId, "searchHistory");
    const snapshot = await getDocs(searchRef);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error) {
    console.error("Error clearing search history:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// USER PREFERENCES
// ============================================

// Update category preference (for recommendations)
export const updateCategoryPreference = async (userId, category) => {
  if (!userId || !category) return;

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const currentPrefs = userSnap.data().preferences?.categoryStats || {};
      const currentCount = currentPrefs[category] || 0;

      await updateDoc(userRef, {
        [`preferences.categoryStats.${category}`]: currentCount + 1,
        "preferences.lastWatchedCategory": category,
      });
    }
  } catch (error) {
    console.error("Error updating category preference:", error);
  }
};

// Get user preferences
export const getUserPreferences = async (userId) => {
  if (!userId) return null;

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().preferences || {};
    }
    return null;
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return null;
  }
};

// Get most watched category
export const getMostWatchedCategory = async (userId) => {
  if (!userId) return "New";

  try {
    const prefs = await getUserPreferences(userId);
    const stats = prefs?.categoryStats || {};

    if (Object.keys(stats).length === 0) return "New";

    const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  } catch (error) {
    console.error("Error getting most watched category:", error);
    return "New";
  }
};

// ============================================
// VIDEO COMMENTS (Platform-specific)
// ============================================

// Add comment to video
export const addComment = async (userId, videoId, commentText, userData) => {
  if (!userId || !videoId || !commentText?.trim()) return { success: false };

  try {
    const commentId = `${userId}_${Date.now()}`;
    const commentRef = doc(db, "videoComments", videoId, "comments", commentId);

    await setDoc(commentRef, {
      userId,
      userName: userData?.displayName || "Anonymous",
      userAvatar: userData?.photoURL || null,
      text: commentText.trim(),
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
    });

    return { success: true, commentId };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: error.message };
  }
};

// Get comments for video
export const getVideoComments = async (videoId, limitCount = 50) => {
  if (!videoId) return [];

  try {
    const commentsRef = collection(db, "videoComments", videoId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
};

// Like/unlike comment
export const toggleCommentLike = async (userId, videoId, commentId) => {
  if (!userId || !videoId || !commentId) return { success: false };

  try {
    const commentRef = doc(db, "videoComments", videoId, "comments", commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) return { success: false };

    const likedBy = commentSnap.data().likedBy || [];
    const isLiked = likedBy.includes(userId);

    if (isLiked) {
      await updateDoc(commentRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId),
      });
    } else {
      await updateDoc(commentRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId),
      });
    }

    return { success: true, isLiked: !isLiked };
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// VIDEO LIKES (Platform-specific)
// ============================================

// Toggle video like
export const toggleVideoLike = async (userId, videoId) => {
  if (!userId || !videoId) return { success: false };

  try {
    const likeRef = doc(db, "videoLikes", videoId);
    const likeSnap = await getDoc(likeRef);

    if (!likeSnap.exists()) {
      await setDoc(likeRef, {
        likes: 1,
        likedBy: [userId],
      });
      return { success: true, isLiked: true, likes: 1 };
    }

    const likedBy = likeSnap.data().likedBy || [];
    const isLiked = likedBy.includes(userId);

    if (isLiked) {
      await updateDoc(likeRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId),
      });
    } else {
      await updateDoc(likeRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId),
      });
    }

    const newSnap = await getDoc(likeRef);
    return {
      success: true,
      isLiked: !isLiked,
      likes: newSnap.data().likes,
    };
  } catch (error) {
    console.error("Error toggling video like:", error);
    return { success: false, error: error.message };
  }
};

// Get video likes
export const getVideoLikes = async (videoId, userId = null) => {
  if (!videoId) return { likes: 0, isLiked: false };

  try {
    const likeRef = doc(db, "videoLikes", videoId);
    const likeSnap = await getDoc(likeRef);

    if (!likeSnap.exists()) {
      return { likes: 0, isLiked: false };
    }

    const data = likeSnap.data();
    return {
      likes: data.likes || 0,
      isLiked: userId ? (data.likedBy || []).includes(userId) : false,
    };
  } catch (error) {
    console.error("Error getting video likes:", error);
    return { likes: 0, isLiked: false };
  }
};
