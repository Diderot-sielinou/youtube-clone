import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill, BsThreeDotsVertical } from "react-icons/bs";
import { MdWatchLater, MdPlaylistAdd, MdOutlinePlaylistAdd } from "react-icons/md";
import { abbreviateNumber } from "js-abbreviation-number";
import PropTypes from "prop-types";

import { Context } from "../context/contextApi";
import VideoLength from "../shared/videoLength";

export default function VideoCard({ video }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);

  const { isAuthenticated, saveToWatchLater, saveFavorite } = useContext(Context);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWatchLater = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    await saveToWatchLater(video);
    setShowMenu(false);
  };

  const handleAddToFavorites = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    await saveFavorite(video);
    setShowMenu(false);
  };

  return (
    <div 
      className="flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Thumbnail */}
      <Link to={`/video/${video?.videoId}`}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
          <img
            className="h-full w-full object-cover"
            src={video?.thumbnails?.[0]?.url}
            alt={video?.title}
          />
          {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />}
          
          {/* Hover overlay with preview controls */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/0 flex items-end justify-end p-2 gap-1">
              <button
                onClick={handleWatchLater}
                className="p-1.5 bg-black/80 rounded text-white hover:bg-black transition-colors"
                title="Watch Later"
              >
                <MdWatchLater className="text-lg" />
              </button>
              <button
                onClick={handleAddToFavorites}
                className="p-1.5 bg-black/80 rounded text-white hover:bg-black transition-colors"
                title="Add to queue"
              >
                <MdOutlinePlaylistAdd className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex mt-3">
        {/* Channel Avatar */}
        <Link to={`/video/${video?.videoId}`} className="flex-shrink-0">
          <div className="h-9 w-9 rounded-full overflow-hidden bg-white/10">
            {video?.author?.avatar?.[0]?.url && (
              <img
                className="h-full w-full object-cover"
                src={video?.author?.avatar?.[0]?.url}
                alt={video?.author?.title}
              />
            )}
          </div>
        </Link>

        {/* Title and Meta */}
        <div className="flex flex-col ml-3 flex-1 overflow-hidden">
          <Link to={`/video/${video?.videoId}`}>
            <span className="text-white text-sm font-medium line-clamp-2 leading-5">
              {video?.title}
            </span>
          </Link>

          <Link to={`/video/${video?.videoId}`} className="mt-1">
            <span className="text-white/60 text-xs flex items-center hover:text-white/80">
              {video?.author?.title}
              {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
                <BsFillCheckCircleFill className="text-white/60 text-[10px] ml-1" />
              )}
            </span>
          </Link>

          <div className="flex text-white/60 text-xs mt-0.5">
            <span>{abbreviateNumber(video?.stats?.views || 0, 1)} views</span>
            <span className="mx-1">•</span>
            <span>{video?.publishedTimeText}</span>
          </div>
        </div>

        {/* More Options */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}
            className={`p-1 rounded-full hover:bg-white/10 transition-opacity ${
              isHovered || showMenu ? "opacity-100" : "opacity-0"
            }`}
          >
            <BsThreeDotsVertical className="text-white text-lg" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-[#282828] rounded-xl shadow-lg overflow-hidden z-50">
              <button
                onClick={handleWatchLater}
                disabled={!isAuthenticated}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors text-sm ${
                  !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <MdWatchLater className="text-xl" />
                Save to Watch Later
              </button>
              <button
                onClick={handleAddToFavorites}
                disabled={!isAuthenticated}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors text-sm ${
                  !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <MdPlaylistAdd className="text-xl" />
                Save to playlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

VideoCard.propTypes = {
  video: PropTypes.object.isRequired,
};
