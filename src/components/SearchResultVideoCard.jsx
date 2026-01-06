import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill, BsThreeDotsVertical } from "react-icons/bs";
import { MdWatchLater, MdPlaylistAdd } from "react-icons/md";
import { abbreviateNumber } from "js-abbreviation-number";
import PropTypes from "prop-types";

import { Context } from "../context/contextApi";
import VideoLength from "../shared/videoLength";

export default function SearchResultVideoCard({ video }) {
  const [showMenu, setShowMenu] = useState(false);
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
    <div className="flex gap-4 mb-4 group">
      {/* Thumbnail */}
      <Link to={`/video/${video?.videoId}`} className="flex-shrink-0">
        <div className="relative w-[360px] h-[202px] rounded-xl overflow-hidden bg-white/5">
          <img
            className="h-full w-full object-cover"
            src={video?.thumbnails?.[0]?.url}
            alt={video?.title}
          />
          {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />}
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex-1 min-w-0 pr-6">
        <Link to={`/video/${video?.videoId}`}>
          <h3 className="text-white text-lg font-normal line-clamp-2 mb-1 hover:text-white/80">
            {video?.title}
          </h3>
        </Link>

        <div className="flex items-center text-white/60 text-xs mb-2">
          <span>{abbreviateNumber(video?.stats?.views || 0, 1)} views</span>
          <span className="mx-1">•</span>
          <span>{video?.publishedTimeText}</span>
        </div>

        {/* Channel Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
            {video?.author?.avatar?.[0]?.url && (
              <img
                className="h-full w-full object-cover"
                src={video?.author?.avatar?.[0]?.url}
                alt={video?.author?.title}
              />
            )}
          </div>
          <span className="text-white/60 text-xs flex items-center">
            {video?.author?.title}
            {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
              <BsFillCheckCircleFill className="text-[10px] ml-1" />
            )}
          </span>
        </div>

        {/* Description */}
        <p className="text-white/50 text-xs line-clamp-2 hidden md:block">
          {video?.descriptionSnippet}
        </p>

        {/* Badges */}
        {video?.badges?.length > 0 && (
          <div className="flex gap-2 mt-2">
            {video.badges.map((badge, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* More Options */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-white/10 transition-all"
        >
          <BsThreeDotsVertical className="text-white text-lg" />
        </button>

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
  );
}

SearchResultVideoCard.propTypes = {
  video: PropTypes.object.isRequired,
};
