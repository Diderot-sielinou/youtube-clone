import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { MdSend } from "react-icons/md";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { Context } from "../context/contextApi";

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const { user, isAuthenticated, fetchComments, postComment, likeComment } =
    useContext(Context);

  useEffect(() => {
    if (videoId) {
      loadComments();
    }
  }, [videoId]);

  const loadComments = async () => {
    setLocalLoading(true);
    const data = await fetchComments(videoId);
    setComments(data);
    setLocalLoading(false);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setPosting(true);
    const result = await postComment(videoId, newComment, user);

    if (result.success) {
      setNewComment("");
      // Reload comments to get the new one
      await loadComments();
    }
    setPosting(false);
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) return;

    const result = await likeComment(videoId, commentId);
    if (result.success) {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: result.isLiked ? comment.likes + 1 : comment.likes - 1,
                likedBy: result.isLiked
                  ? [...(comment.likedBy || []), user.uid]
                  : (comment.likedBy || []).filter((id) => id !== user.uid),
              }
            : comment
        )
      );
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-white font-bold text-lg mb-4">
        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </h3>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="flex gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-red-600 flex items-center justify-center text-white font-bold">
                {user?.displayName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="bg-transparent border-b border-white/30 focus:border-white text-white py-2 outline-none transition-colors"
            />
            <div className="flex justify-end gap-2 mt-2">
              {newComment && (
                <button
                  type="button"
                  onClick={() => setNewComment("")}
                  className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-full transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!newComment.trim() || posting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <MdSend className="text-lg" />
                )}
                Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-white/50 text-sm mb-6 p-4 bg-white/5 rounded-lg text-center">
          Please sign in to leave a comment
        </div>
      )}

      {/* Comments List */}
      {localLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-white/50 text-sm text-center py-8">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                {comment.userAvatar ? (
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white font-bold">
                    {comment.userName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {comment.userName}
                  </span>
                  <span className="text-white/50 text-xs">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-white/90 text-sm mt-1">{comment.text}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={!isAuthenticated}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      comment.likedBy?.includes(user?.uid)
                        ? "text-blue-500"
                        : "text-white/50 hover:text-white"
                    } ${!isAuthenticated ? "cursor-not-allowed" : ""}`}
                  >
                    {comment.likedBy?.includes(user?.uid) ? (
                      <AiFillLike className="text-lg" />
                    ) : (
                      <AiOutlineLike className="text-lg" />
                    )}
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

CommentSection.propTypes = {
  videoId: PropTypes.string.isRequired,
};
