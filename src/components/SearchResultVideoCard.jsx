import { useState, useContext } from "react";
import { abbreviateNumber } from "js-abbreviation-number";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdMoreVert, MdWatchLater, MdFavorite } from "react-icons/md";
import PropTypes from "prop-types";

import VideoLength from "../shared/videoLength";
import { Context } from "../context/contextApi";

export default function SearchResultVideoCard({ video }) {
  const [showMenu, setShowMenu] = useState(false);

  const { isAuthenticated, saveFavorite, saveToWatchLater } = useContext(Context);

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

  return (
    <div className="relative group">
      <Link to={`/video/${video?.videoId}`}>
        <div className="flex gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors">
          {/* Thumbnail */}
          <div className="relative h-24 lg:h-28 xl:h-32 w-44 min-w-[176px] lg:w-52 lg:min-w-[208px] xl:w-60 xl:min-w-[240px] rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
            <img
              className="h-full w-full object-cover"
              src={video?.thumbnails?.[0]?.url}
              alt={video?.title}
            />
            {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />}
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 overflow-hidden py-1">
            <span className="text-white text-base lg:text-lg font-medium line-clamp-2">
              {video?.title}
            </span>

            <div className="flex items-center gap-2 text-white/60 text-xs mt-2">
              <span>{abbreviateNumber(video?.stats?.views || 0, 2)} views</span>
              <span>•</span>
              <span>{video?.publishedTimeText}</span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              {video?.author?.avatar?.[0]?.url && (
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={video.author.avatar[0].url}
                    alt={video.author.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <span className="text-white/60 text-sm flex items-center">
                {video?.author?.title}
                {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
                  <BsFillCheckCircleFill className="text-white/50 text-[10px] ml-1" />
                )}
              </span>
            </div>

            {video?.descriptionSnippet && (
              <p className="text-white/50 text-xs mt-2 line-clamp-2 hidden md:block">
                {video.descriptionSnippet}
              </p>
            )}
          </div>

          {/* More Button */}
          {isAuthenticated && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <MdMoreVert className="text-white text-xl" />
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-12 top-2 z-50 bg-[#212121] rounded-lg shadow-lg py-2 min-w-[200px]">
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

SearchResultVideoCard.propTypes = {
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
    descriptionSnippet: PropTypes.string,
  }),
};
