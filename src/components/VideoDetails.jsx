import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
} from "react-icons/ai";
import { MdWatchLater, MdFavorite, MdShare, MdPlaylistAdd } from "react-icons/md";
import { abbreviateNumber } from "js-abbreviation-number";

import { fetchDataFromApi } from "../utils/api";
import { Context } from "../context/contextApi";
import SuggestionVideoCard from "./SuggestionVideoCard";
import CommentSection from "./CommentSection";

export default function VideoDetails() {
  const [video, setVideo] = useState();
  const [relatedVideos, setRelatedVideos] = useState();
  const [platformLikes, setPlatformLikes] = useState({ likes: 0, isLiked: false });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

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
          const searchQuery = video.title.split(' ').slice(0, 3).join(' ');
          const searchRes = await fetchDataFromApi(`search/?q=${encodeURIComponent(searchQuery)}`);
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

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-black">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
          {/* Video Player */}
          <div className="h-[200px] md:h-[400px] lg:h-[420px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0 rounded-xl overflow-hidden">
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
          <div className="text-white font-bold text-sm md:text-xl mt-4 line-clamp-2">
            {video?.title}
          </div>

          {/* Channel Info and Actions */}
          <div className="flex justify-between flex-col md:flex-row mt-4 gap-4">
            {/* Channel Info */}
            <div className="flex items-center">
              <div className="flex h-11 w-11 rounded-full overflow-hidden flex-shrink-0">
                <img
                  className="h-full w-full object-cover"
                  src={video?.author?.avatar?.[0]?.url}
                  alt={video?.author?.title}
                />
              </div>
              <div className="flex flex-col ml-3">
                <div className="text-white text-md font-semibold flex items-center">
                  {video?.author?.title}
                  {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
                    <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] ml-1" />
                  )}
                </div>
                <div className="text-white/[0.7] text-sm">
                  {video?.author?.stats?.subscribersText}
                </div>
              </div>
              <button className="ml-6 px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={!isAuthenticated}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  platformLikes.isLiked
                    ? "bg-blue-600 text-white"
                    : "bg-white/[0.15] text-white hover:bg-white/[0.25]"
                } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {platformLikes.isLiked ? (
                  <AiFillLike className="text-xl" />
                ) : (
                  <AiOutlineLike className="text-xl" />
                )}
                <span>{abbreviateNumber(platformLikes.likes || 0, 2)}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.15] text-white rounded-full hover:bg-white/[0.25] transition-colors">
                <AiOutlineDislike className="text-xl" />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.15] text-white rounded-full hover:bg-white/[0.25] transition-colors"
              >
                <MdShare className="text-xl" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Watch Later */}
              <button
                onClick={handleWatchLater}
                disabled={!isAuthenticated}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isInWatchLater
                    ? "bg-blue-600 text-white"
                    : "bg-white/[0.15] text-white hover:bg-white/[0.25]"
                } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MdWatchLater className="text-xl" />
                <span className="hidden sm:inline">
                  {isInWatchLater ? "Saved" : "Save"}
                </span>
              </button>

              {/* Favorite */}
              <button
                onClick={handleFavorite}
                disabled={!isAuthenticated}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isFavorite
                    ? "bg-red-600 text-white"
                    : "bg-white/[0.15] text-white hover:bg-white/[0.25]"
                } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MdFavorite className="text-xl" />
              </button>
            </div>
          </div>

          {/* Video Stats and Description */}
          <div className="mt-4 p-4 bg-white/[0.1] rounded-xl">
            <div className="flex gap-2 text-white text-sm font-medium mb-2">
              <span>{abbreviateNumber(video?.stats?.views || 0, 2)} views</span>
              <span>•</span>
              <span>{video?.publishedDate}</span>
            </div>

            {/* Description */}
            <div
              className={`text-white/80 text-sm whitespace-pre-wrap ${
                !showDescription ? "line-clamp-3" : ""
              }`}
            >
              {video?.description}
            </div>

            {video?.description?.length > 200 && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-white font-medium text-sm mt-2 hover:underline"
              >
                {showDescription ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {/* Comments Section */}
          <CommentSection videoId={id} />
        </div>

        {/* Related Videos Sidebar */}
        <div className="flex flex-col py-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px]">
          <h3 className="text-white font-bold text-lg mb-4">Related Videos</h3>
          {relatedVideos?.contents?.length > 0 ? (
            relatedVideos.contents.map((item, index) => {
              // Handle different response formats
              const videoData = item?.video || item;
              if (item?.type !== "video" && videoData?.type !== "video") return null;
              // Skip current video
              if (videoData?.videoId === id) return null;
              return <SuggestionVideoCard key={index} video={videoData} />;
            })
          ) : (
            <div className="text-white/50 text-sm">No related videos found</div>
          )}
        </div>
      </div>
    </div>
  );
}
