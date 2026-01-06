import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineLike, AiFillLike, AiOutlineDislike } from "react-icons/ai";
import {
  MdWatchLater,
  MdFavorite,
  MdShare,
  MdPlaylistAdd,
  MdOutlineSort,
} from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { abbreviateNumber } from "js-abbreviation-number";

import { fetchDataFromApi } from "../utils/api";
import { Context } from "../context/contextApi";
import SuggestionVideoCard from "./SuggestionVideoCard";

// Static comments data (reduced to 6 comments)
const staticComments = [
  {
    id: 1,
    username: "@musiclover2024",
    avatar: null,
    text: "This is absolutely amazing! I've been listening to this on repeat for hours. 🔥",
    likes: 2453,
    time: "2 weeks ago",
    replies: 45,
    isHearted: true,
  },
  {
    id: 2,
    username: "@JohnDoe",
    avatar: null,
    text: "Who's watching this in 2025? Still hits different! 💯",
    likes: 8932,
    time: "1 month ago",
    replies: 234,
    isPinned: true,
  },
  {
    id: 3,
    username: "@creativemind",
    avatar: null,
    text: "The production quality on this video is insane. Huge props to the team!",
    likes: 567,
    time: "3 days ago",
    replies: 12,
  },
  {
    id: 4,
    username: "@TechEnthusiast",
    avatar: null,
    text: "I came across this by accident but I needed it's message. I'm a fan now!",
    likes: 1834,
    time: "2 months ago",
    replies: 67,
  },
  {
    id: 5,
    username: "@SarahM",
    avatar: null,
    text: "This is fire... Just discovered you today.... Also, this is a good use of Ai 👏",
    likes: 432,
    time: "1 week ago",
    replies: 8,
  },
  {
    id: 6,
    username: "@GlobalViewer",
    avatar: null,
    text: "Watching from Brazil 🇧🇷 This content is universal!",
    likes: 1205,
    time: "5 days ago",
    replies: 156,
  },
];

// Function to get random comments
const getRandomComments = (count = 5) => {
  const shuffled = [...staticComments].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Comment Component
const CommentItem = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const getInitials = (username) => {
    return username.replace("@", "").charAt(0).toUpperCase();
  };

  const getRandomColor = (username) => {
    const colors = [
      "bg-red-600",
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-yellow-600",
      "bg-indigo-600",
      "bg-teal-600",
    ];
    const index = username.length % colors.length;
    return colors[index];
  };

  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 ${getRandomColor(
          comment.username
        )}`}
      >
        {getInitials(comment.username)}
      </div>

      {/* Comment Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-[13px] font-medium">
            {comment.username}
          </span>
          <span className="text-white/50 text-xs">{comment.time}</span>
          {comment.isPinned && (
            <span className="text-white/50 text-xs bg-white/10 px-2 py-0.5 rounded">
              Pinned
            </span>
          )}
        </div>

        <p className="text-white text-sm leading-5 mb-2">{comment.text}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex items-center gap-1 text-white/70 hover:text-white"
          >
            {isLiked ? (
              <AiFillLike className="text-lg text-blue-500" />
            ) : (
              <AiOutlineLike className="text-lg" />
            )}
            <span className="text-xs">
              {abbreviateNumber(comment.likes + (isLiked ? 1 : 0), 1)}
            </span>
          </button>
          <button className="text-white/70 hover:text-white">
            <AiOutlineDislike className="text-lg" />
          </button>
          {comment.isHearted && (
            <span className="text-red-500 text-sm">❤️</span>
          )}
          <button className="text-white/70 hover:text-white text-xs font-medium">
            Reply
          </button>
        </div>

        {/* Replies */}
        {comment.replies > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-blue-400 text-sm font-medium mt-2 hover:bg-blue-400/10 px-2 py-1 rounded-full -ml-2"
          >
            <span
              className={`transform transition-transform ${
                showReplies ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
            {comment.replies} replies
          </button>
        )}
      </div>
    </div>
  );
};

export default function VideoDetails() {
  const [video, setVideo] = useState();
  const [relatedVideos, setRelatedVideos] = useState();
  const [platformLikes, setPlatformLikes] = useState({
    likes: 0,
    isLiked: false,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showCommentActions, setShowCommentActions] = useState(false);

  const { id } = useParams();
  const {
    setLoading,
    user,
    isAuthenticated,
    saveToHistory,
    saveFavorite,
    removeFavorite,
    saveToWatchLater,
    removeWatchLater,
    checkIsFavorite,
    checkIsWatchLater,
    likeVideo,
    fetchVideoLikes,
  } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.add("custom-h");
    fetchVideoDetails();
    // Get random static comments
    setComments(getRandomComments(5));

    // Scroll to top on video change
    window.scrollTo(0, 0);

    return () => {
      document.getElementById("root").classList.remove("custom-h");
    };
  }, [id]);

  // Fetch related videos after video details are loaded
  useEffect(() => {
    if (video) {
      fetchRelatedVideos();
    }
  }, [video?.videoId]);

  // Check user's interaction status
  useEffect(() => {
    if (isAuthenticated && id) {
      checkUserInteractions();
    }
  }, [isAuthenticated, id]);

  const checkUserInteractions = async () => {
    const [favorite, watchLater, likes] = await Promise.all([
      checkIsFavorite(id),
      checkIsWatchLater(id),
      fetchVideoLikes(id),
    ]);

    setIsFavorite(favorite);
    setIsInWatchLater(watchLater);
    setPlatformLikes(likes);
  };

  const fetchVideoDetails = () => {
    setLoading(true);
    fetchDataFromApi(`video/details/?id=${id}`).then((res) => {
      console.log("detail video", res);
      setVideo(res);
      setLoading(false);

      // Save to history if user is authenticated
      if (isAuthenticated && res) {
        saveToHistory(res);
      }
    });
  };

  const fetchRelatedVideos = async () => {
    setLoading(true);
    try {
      // Try the related-contents endpoint first
      const res = await fetchDataFromApi(`video/related-contents/?id=${id}`);
      console.log("related video", res);

      // Check if we got results
      if (res?.contents && res.contents.length > 0) {
        setRelatedVideos(res);
      } else {
        // Fallback: use search with video title keywords
        console.log("No related videos, using search fallback");
        if (video?.title) {
          // Extract first few words from title for search
          const searchQuery = video.title.split(" ").slice(0, 3).join(" ");
          const searchRes = await fetchDataFromApi(
            `search/?q=${encodeURIComponent(searchQuery)}`
          );
          console.log("search fallback", searchRes);
          setRelatedVideos(searchRes);
        }
      }
    } catch (error) {
      console.error("Error fetching related videos:", error);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;

    const result = await likeVideo(id);
    if (result.success) {
      setPlatformLikes({
        likes: result.likes,
        isLiked: result.isLiked,
      });
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) return;

    if (isFavorite) {
      await removeFavorite(id);
      setIsFavorite(false);
    } else {
      await saveFavorite(video);
      setIsFavorite(true);
    }
  };

  const handleWatchLater = async () => {
    if (!isAuthenticated) return;

    if (isInWatchLater) {
      await removeWatchLater(id);
      setIsInWatchLater(false);
    } else {
      await saveToWatchLater(video);
      setIsInWatchLater(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      username: `@${user?.displayName?.replace(/\s/g, "") || "User"}`,
      avatar: user?.photoURL,
      text: commentText,
      likes: 0,
      time: "Just now",
      replies: 0,
    };

    setComments([newComment, ...comments]);
    setCommentText("");
    setShowCommentActions(false);
  };

  // Calculate total comments (static + random variation)
  const totalComments = Math.floor(Math.random() * 500) + 50;

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-[#0f0f0f]">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
          {/* Video Player - Fixed Height */}
          <div className="h-[200px] md:h-[400px] lg:h-[420px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0 rounded-xl overflow-hidden flex-shrink-0">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              controls
              width="100%"
              height="100%"
              style={{ backgroundColor: "#000000" }}
              playing={true}
            />
          </div>

          {/* Video Title */}
          <h1 className="text-white font-bold text-lg md:text-xl mt-4 line-clamp-2">
            {video?.title}
          </h1>

          {/* Channel Info and Actions */}
          <div className="flex justify-between flex-col md:flex-row mt-4 gap-3">
            {/* Channel Info */}
            <div className="flex items-center">
              <div className="flex h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  className="h-full w-full object-cover"
                  src={video?.author?.avatar?.[0]?.url}
                  alt={video?.author?.title}
                />
              </div>
              <div className="flex flex-col ml-3">
                <div className="text-white text-sm font-medium flex items-center">
                  {video?.author?.title}
                  {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
                    <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] ml-1" />
                  )}
                </div>
                <div className="text-white/[0.5] text-xs">
                  {video?.author?.stats?.subscribersText}
                </div>
              </div>
              <button className="ml-6 px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Like/Dislike Group */}
              <div className="flex items-center bg-white/[0.1] rounded-full">
                <button
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                  className={`flex items-center gap-2 px-4 py-2 rounded-l-full border-r border-white/20 transition-colors ${
                    platformLikes.isLiked
                      ? "text-blue-400"
                      : "text-white hover:bg-white/[0.15]"
                  } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {platformLikes.isLiked ? (
                    <AiFillLike className="text-xl" />
                  ) : (
                    <AiOutlineLike className="text-xl" />
                  )}
                  <span className="text-sm font-medium">
                    {abbreviateNumber(
                      platformLikes.likes || video?.stats?.likes || 0,
                      1
                    )}
                  </span>
                </button>
                <button className="px-4 py-2 rounded-r-full text-white hover:bg-white/15 transition-colors">
                  <AiOutlineDislike className="text-xl" />
                </button>
              </div>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/[0.15] transition-colors"
              >
                <RiShareForwardLine className="text-xl" />
                <span className="text-sm font-medium hidden sm:inline">
                  Share
                </span>
              </button>

              {/* Download */}
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/[0.15] transition-colors">
                <HiDownload className="text-xl" />
                <span className="text-sm font-medium hidden sm:inline">
                  Download
                </span>
              </button>

              {/* Save */}
              <button
                onClick={handleWatchLater}
                disabled={!isAuthenticated}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isInWatchLater
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/15"
                } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MdPlaylistAdd className="text-xl" />
                <span className="text-sm font-medium hidden sm:inline">
                  {isInWatchLater ? "Saved" : "Save"}
                </span>
              </button>

              {/* Favorite */}
              <button
                onClick={handleFavorite}
                disabled={!isAuthenticated}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isFavorite
                    ? "bg-red-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/15"
                } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
                title={
                  isFavorite
                    ? "Remove from liked videos"
                    : "Add to liked videos"
                }
              >
                <MdFavorite className="text-xl" />
              </button>

              {/* More */}
              <button className="flex items-center justify-center w-10 h-10 bg-white/[0.1] text-white rounded-full hover:bg-white/[0.15] transition-colors">
                <BiDotsHorizontalRounded className="text-xl" />
              </button>
            </div>
          </div>

          {/* Video Stats and Description */}
          <div className="mt-4 p-3 bg-white/10 rounded-xl">
            <div className="flex gap-2 text-white text-sm font-medium mb-2">
              <span>{abbreviateNumber(video?.stats?.views || 0, 1)} views</span>
              <span>•</span>
              <span>{video?.publishedDate}</span>
            </div>

            {/* Description */}
            <div
              className={`text-white/90 text-sm whitespace-pre-wrap ${
                !showDescription ? "line-clamp-2" : ""
              }`}
            >
              {video?.description}
            </div>

            {video?.description?.length > 100 && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-white font-medium text-sm mt-2 hover:text-white/80"
              >
                {showDescription ? "Show less" : "...more"}
              </button>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            {/* Comments Header */}
            <div className="flex items-center gap-8 mb-6">
              <span className="text-white text-xl font-bold">
                {totalComments} Comments
              </span>
              <button className="flex items-center gap-2 text-white text-sm">
                <MdOutlineSort className="text-2xl" />
                <span>Sort by</span>
              </button>
            </div>

            {/* Add Comment */}
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                {user?.displayName?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                    setShowCommentActions(true);
                  }}
                  onFocus={() => setShowCommentActions(true)}
                  placeholder="Add a comment..."
                  className="w-full bg-transparent border-b border-white/20 text-white text-sm py-2 focus:outline-none focus:border-white placeholder-white/50"
                />
                {showCommentActions && (
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setCommentText("");
                        setShowCommentActions(false);
                      }}
                      className="px-4 py-2 text-white text-sm font-medium hover:bg-white/10 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className={`px-4 py-2 text-sm font-medium rounded-full ${
                        commentText.trim()
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-white/10 text-white/50 cursor-not-allowed"
                      }`}
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar */}
        <div className="flex flex-col py-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px]">
          <h3 className="text-white font-bold text-lg mb-4">Related Videos</h3>
          {relatedVideos?.contents?.length > 0 ? (
            relatedVideos.contents.map((item, index) => {
              // Handle different response formats
              const videoData = item?.video || item;
              if (item?.type !== "video" && videoData?.type !== "video")
                return null;
              // Skip current video
              if (videoData?.videoId === id) return null;
              return <SuggestionVideoCard key={index} video={videoData} />;
            })
          ) : (
            <div className="text-white/50 text-sm">Loading suggestions...</div>
          )}
        </div>
      </div>
    </div>
  );
}
