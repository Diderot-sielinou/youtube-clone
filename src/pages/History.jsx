import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdHistory, MdSearch, MdClose } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { abbreviateNumber } from "js-abbreviation-number";

import { Context } from "../context/contextApi";
import LeftNav from "../components/LeftNav";
import VideoLength from "../shared/videoLength";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { fetchHistory, deleteFromHistory, deleteHistory } = useContext(Context);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await fetchHistory();
    setHistory(data || []);
    setLoading(false);
  };

  const handleRemove = async (videoId) => {
    await deleteFromHistory(videoId);
    setHistory(history.filter((item) => item.videoId !== videoId));
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all watch history?")) {
      await deleteHistory();
      setHistory([]);
    }
  };

  const filteredHistory = searchQuery
    ? history.filter((item) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : history;

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="flex-1 overflow-y-auto bg-[#0f0f0f]">
        <div className="max-w-[1096px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold">Watch history</h1>
          </div>

          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex gap-4 mb-4 animate-pulse">
                    <div className="w-[246px] h-[138px] bg-white/10 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
                      <div className="h-4 bg-white/10 rounded w-1/3" />
                    </div>
                  </div>
                ))
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <div key={item.videoId || index} className="flex gap-4 mb-4 group">
                    {/* Thumbnail */}
                    <Link to={`/video/${item.videoId}`}>
                      <div className="relative w-[246px] h-[138px] rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        <img
                          className="h-full w-full object-cover"
                          src={item.thumbnail}
                          alt={item.title}
                        />
                        {item.duration && <VideoLength time={item.duration} />}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/video/${item.videoId}`}>
                        <h3 className="text-white font-medium text-lg line-clamp-2 mb-1 hover:text-white/80">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="flex items-center text-white/60 text-sm mb-1">
                        <span>{item.channelTitle}</span>
                        <BsFillCheckCircleFill className="text-[10px] ml-1" />
                        <span className="mx-1">•</span>
                        <span>{abbreviateNumber(item.views || 0, 1)} views</span>
                      </div>
                      <p className="text-white/50 text-xs">
                        Watched {formatDate(item.watchedAt)}
                        {item.watchCount > 1 && ` • ${item.watchCount} times`}
                      </p>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleRemove(item.videoId)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all h-fit"
                      title="Remove from history"
                    >
                      <MdClose className="text-xl" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/50">
                  <MdHistory className="text-8xl mb-4 opacity-50" />
                  <p className="text-xl font-medium mb-2">No watch history</p>
                  <p className="text-sm">Videos you watch will appear here</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-[300px] flex-shrink-0">
              {/* Search History */}
              <div className="relative mb-6">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xl" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search watch history"
                  className="w-full bg-transparent border-b border-white/20 text-white text-sm py-2 pl-10 pr-4 focus:outline-none focus:border-white placeholder-white/50"
                />
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleClearAll}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <MdDelete className="text-xl" />
                  <span className="text-sm font-medium">Clear all watch history</span>
                </button>
              </div>

              {/* Info */}
              <div className="mt-8 p-4 bg-white/5 rounded-xl">
                <p className="text-white/70 text-sm leading-relaxed">
                  Your watch history is saved to your account and used to improve your recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
