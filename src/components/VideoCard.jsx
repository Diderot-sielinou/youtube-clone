import { useState, useContext } from "react";
import { abbreviateNumber } from "js-abbreviation-number";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdWatchLater, MdFavorite, MdMoreVert } from "react-icons/md";
import PropTypes from "prop-types";

import VideoLength from "../shared/videoLength";
import { Context } from "../context/contextApi";

export default function VideoCard({ video }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const { isAuthenticated, saveFavorite, saveToWatchLater } = useContext(Context);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left,
      y: rect.bottom,
    });
    setShowMenu(!showMenu);
  };

  const handleAddToFavorites = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);

    await saveFavorite(video);
  };

  const handleAddToWatchLater = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);

    await saveToWatchLater(video);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Link to={`/video/${video?.videoId}`}>
        <div className="flex flex-col mb-8 group">
          <div className="relative h-48 md:h-40 md:rounded-xl overflow-hidden">
            <img
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={video?.thumbnails?.[0]?.url}
              alt={video?.title}
            />
            {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />}

            {/* Hover Actions */}
            {isAuthenticated && (
              <div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleMenuClick}
              >
                <button className="p-1.5 bg-black/70 hover:bg-black rounded-full text-white transition-colors">
                  <MdMoreVert className="text-lg" />
                </button>
              </div>
            )}
          </div>

          <div className="flex text-white mt-3">
            <div className="flex items-start">
              <div className="flex h-9 w-9 rounded-full overflow-hidden flex-shrink-0">
                <img
                  className="h-full w-full object-cover"
                  src={video?.author?.avatar?.[0]?.url}
                  alt={video?.author?.title}
                />
              </div>
            </div>
            <div className="flex flex-col ml-3 overflow-hidden">
              <span className="text-sm font-bold line-clamp-2 group-hover:text-red-500 transition-colors">
                {video?.title}
              </span>
              <span className="text-[12px] font-semibold mt-2 text-white/[0.7] flex items-center">
                {video?.author?.title}
                {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
                  <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] ml-1" />
                )}
              </span>
              <div className="flex text-[12px] font-semibold text-white/[0.7] truncate overflow-hidden">
                <span>{`${abbreviateNumber(video?.stats?.views || 0, 2)} views`}</span>
                <span className="flex text-[24px] leading-none font-bold text-white/[0.7] relative top-[-10px] mx-1">
                  .
                </span>
                <span className="truncate">{video?.publishedTimeText}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={closeMenu} />

          {/* Menu */}
          <div
            className="fixed z-50 bg-[#212121] rounded-lg shadow-lg py-2 min-w-[200px]"
            style={{
              top: menuPosition.y,
              left: Math.min(menuPosition.x, window.innerWidth - 220),
            }}
          >
            <button
              onClick={handleAddToWatchLater}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
            >
              <MdWatchLater className="text-xl" />
              <span>Save to Watch Later</span>
            </button>
            <button
              onClick={handleAddToFavorites}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
            >
              <MdFavorite className="text-xl" />
              <span>Add to Favorites</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    videoId: PropTypes.string,
    title: PropTypes.string,
    thumbnails: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ),
    lengthSeconds: PropTypes.number,
    author: PropTypes.shape({
      title: PropTypes.string,
      avatar: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
        })
      ),
      badges: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string,
        })
      ),
    }),
    stats: PropTypes.shape({
      views: PropTypes.number,
    }),
    publishedTimeText: PropTypes.string,
  }),
};
