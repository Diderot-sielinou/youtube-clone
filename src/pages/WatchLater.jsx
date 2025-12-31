import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MdWatchLater, MdDelete, MdPlayArrow } from "react-icons/md";
import { abbreviateNumber } from "js-abbreviation-number";
import { Context } from "../context/contextApi";
import LeftNav from "../components/LeftNav";
import VideoLength from "../shared/videoLength";

export default function WatchLater() {
  const [watchLater, setWatchLater] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  const { fetchWatchLater, removeWatchLater } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
    loadWatchLater();
  }, []);

  const loadWatchLater = async () => {
    setLocalLoading(true);
    const data = await fetchWatchLater();
    setWatchLater(data);
    setLocalLoading(false);
  };

  const handleRemoveFromWatchLater = async (videoId) => {
    const result = await removeWatchLater(videoId);
    if (result?.success) {
      setWatchLater(watchLater.filter((item) => item.videoId !== videoId));
    }
  };

  // Calculate total duration
  const totalDuration = watchLater.reduce((acc, video) => acc + (video.duration || 0), 0);
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        <div className="flex flex-col lg:flex-row gap-6 p-5">
          {/* Sidebar - Playlist Info */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-6 sticky top-5">
              {/* Preview Thumbnail */}
              {watchLater.length > 0 && watchLater[0].thumbnail && (
                <div className="relative rounded-lg overflow-hidden mb-4 aspect-video">
                  <img
                    src={watchLater[0].thumbnail}
                    alt="Playlist thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Link
                      to={`/video/${watchLater[0].videoId}`}
                      className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
                    >
                      <MdPlayArrow className="text-xl" />
                      Play All
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <MdWatchLater className="text-3xl text-white" />
                <h1 className="text-2xl font-bold text-white">Watch Later</h1>
              </div>

              <div className="text-white/80 text-sm space-y-1">
                <p>{watchLater.length} video{watchLater.length !== 1 ? "s" : ""}</p>
                {watchLater.length > 0 && (
                  <p>Total: {formatTotalDuration()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Videos List */}
          <div className="flex-1">
            {localLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-white/20 border-t-red-500 rounded-full animate-spin"></div>
              </div>
            ) : watchLater.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/70">
                <MdWatchLater className="text-6xl mb-4" />
                <h2 className="text-xl font-medium mb-2">No videos saved</h2>
                <p className="text-sm">Save videos to watch them later</p>
                <Link
                  to="/"
                  className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                >
                  Browse Videos
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {watchLater.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    {/* Index */}
                    <div className="flex items-center justify-center w-8 text-white/50 text-sm">
                      {index + 1}
                    </div>

                    {/* Thumbnail */}
                    <Link
                      to={`/video/${video.videoId}`}
                      className="relative flex-shrink-0 w-32 h-20 md:w-40 md:h-24 rounded-lg overflow-hidden bg-slate-800"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      {video.duration && <VideoLength time={video.duration} />}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <MdPlayArrow className="text-white text-4xl" />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center overflow-hidden">
                      <Link
                        to={`/video/${video.videoId}`}
                        className="text-white font-medium line-clamp-2 hover:text-red-500 transition-colors text-sm md:text-base"
                      >
                        {video.title}
                      </Link>
                      <p className="text-white/70 text-xs md:text-sm mt-1">
                        {video.channelTitle}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        {abbreviateNumber(video.views || 0, 2)} views
                        {video.publishedTimeText && ` • ${video.publishedTimeText}`}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleRemoveFromWatchLater(video.videoId)}
                      className="self-center p-2 text-white/50 hover:text-red-500 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from Watch Later"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
