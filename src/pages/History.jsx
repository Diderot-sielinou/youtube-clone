import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MdHistory, MdDelete, MdDeleteSweep } from "react-icons/md";
import { Context } from "../context/contextApi";
import LeftNav from "../components/LeftNav";
import VideoLength from "../shared/videoLength";

export default function History() {
  const [history, setHistory] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  const { fetchHistory, deleteFromHistory, deleteHistory, user } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLocalLoading(true);
    const data = await fetchHistory();
    setHistory(data);
    setLocalLoading(false);
  };

  const handleRemoveFromHistory = async (videoId) => {
    const result = await deleteFromHistory(videoId);
    if (result?.success) {
      setHistory(history.filter((item) => item.videoId !== videoId));
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all watch history?")) {
      const result = await deleteHistory();
      if (result?.success) {
        setHistory([]);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        <div className="max-w-5xl mx-auto p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MdHistory className="text-3xl text-white" />
              <h1 className="text-2xl font-bold text-white">Watch History</h1>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <MdDeleteSweep className="text-xl" />
                Clear All
              </button>
            )}
          </div>

          {/* Content */}
          {localLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-white/20 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/70">
              <MdHistory className="text-6xl mb-4" />
              <h2 className="text-xl font-medium mb-2">No watch history</h2>
              <p className="text-sm">Videos you watch will appear here</p>
              <Link
                to="/"
                className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                Browse Videos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((video) => (
                <div
                  key={video.id}
                  className="flex gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/video/${video.videoId}`}
                    className="relative flex-shrink-0 w-40 h-24 md:w-48 md:h-28 rounded-lg overflow-hidden bg-slate-800"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {video.duration && <VideoLength time={video.duration} />}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div>
                      <Link
                        to={`/video/${video.videoId}`}
                        className="text-white font-medium line-clamp-2 hover:text-red-500 transition-colors"
                      >
                        {video.title}
                      </Link>
                      <p className="text-white/70 text-sm mt-1">
                        {video.channelTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 text-xs">
                      <span>Watched {formatDate(video.watchedAt)}</span>
                      {video.watchCount > 1 && (
                        <span>• Watched {video.watchCount} times</span>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveFromHistory(video.videoId)}
                    className="self-center p-2 text-white/50 hover:text-red-500 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from history"
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
  );
}
