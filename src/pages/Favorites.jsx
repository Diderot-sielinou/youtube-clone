import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MdFavorite, MdDelete } from "react-icons/md";
import { abbreviateNumber } from "js-abbreviation-number";
import { Context } from "../context/contextApi";
import LeftNav from "../components/LeftNav";
import VideoLength from "../shared/videoLength";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  const { fetchFavorites, removeFavorite } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLocalLoading(true);
    const data = await fetchFavorites();
    setFavorites(data);
    setLocalLoading(false);
  };

  const handleRemoveFromFavorites = async (videoId) => {
    const result = await removeFavorite(videoId);
    if (result?.success) {
      setFavorites(favorites.filter((item) => item.videoId !== videoId));
    }
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        <div className="max-w-5xl mx-auto p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <MdFavorite className="text-3xl text-red-500" />
            <h1 className="text-2xl font-bold text-white">Liked Videos</h1>
            {favorites.length > 0 && (
              <span className="text-white/50 text-sm ml-2">
                {favorites.length} video{favorites.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Content */}
          {localLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-white/20 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/70">
              <MdFavorite className="text-6xl mb-4" />
              <h2 className="text-xl font-medium mb-2">No liked videos</h2>
              <p className="text-sm">Videos you like will appear here</p>
              <Link
                to="/"
                className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                Browse Videos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favorites.map((video) => (
                <div
                  key={video.id}
                  className="flex flex-col bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors group"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/video/${video.videoId}`}
                    className="relative h-44 overflow-hidden"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {video.duration && <VideoLength time={video.duration} />}
                  </Link>

                  {/* Info */}
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="flex gap-3">
                      {video.channelAvatar && (
                        <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden">
                          <img
                            src={video.channelAvatar}
                            alt={video.channelTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <Link
                          to={`/video/${video.videoId}`}
                          className="text-white text-sm font-medium line-clamp-2 hover:text-red-500 transition-colors"
                        >
                          {video.title}
                        </Link>
                        <p className="text-white/70 text-xs mt-1">
                          {video.channelTitle}
                        </p>
                        <p className="text-white/50 text-xs mt-1">
                          {abbreviateNumber(video.views || 0, 2)} views
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => handleRemoveFromFavorites(video.videoId)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-white/70 hover:text-red-500 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      <MdDelete className="text-lg" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
