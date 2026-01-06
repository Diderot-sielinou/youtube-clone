import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MdPlayArrow, MdShuffle, MdClose, MdWatchLater } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { abbreviateNumber } from "js-abbreviation-number";

import { Context } from "../context/contextApi";
import LeftNav from "../components/LeftNav";
import VideoLength from "../shared/videoLength";

export default function WatchLater() {
  const [watchLater, setWatchLater] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetchWatchLater, removeWatchLater, user } = useContext(Context);

  useEffect(() => {
    loadWatchLater();
  }, []);

  const loadWatchLater = async () => {
    setLoading(true);
    const data = await fetchWatchLater();
    setWatchLater(data || []);
    setLoading(false);
  };

  const handleRemove = async (videoId) => {
    await removeWatchLater(videoId);
    setWatchLater(watchLater.filter((item) => item.videoId !== videoId));
  };

  const totalDuration = watchLater.reduce((acc, item) => acc + (item.duration || 0), 0);
  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} hr ${minutes} min`;
    return `${minutes} min`;
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="flex-1 overflow-y-auto bg-[#0f0f0f]">
        <div className="flex gap-6 p-6">
          {/* Sidebar - Playlist Info */}
          <div className="w-[360px] flex-shrink-0">
            <div className="sticky top-6 bg-gradient-to-b from-[#2d1f3d] to-[#1a1a2e] rounded-2xl p-6 overflow-hidden">
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                {watchLater[0]?.thumbnail ? (
                  <img
                    src={watchLater[0].thumbnail}
                    alt="Playlist cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <MdWatchLater className="text-white text-6xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Playlist Title */}
              <h1 className="text-white text-2xl font-bold mb-2">Watch later</h1>
              <p className="text-white/60 text-sm mb-1">{user?.displayName || "User"}</p>
              <p className="text-white/50 text-xs mb-1">
                {watchLater.length} videos • No views • {formatTotalDuration(totalDuration)}
              </p>
              <p className="text-white/40 text-xs mb-4">Updated today</p>

              {/* Actions */}
              <div className="flex gap-2 mb-4">
                {watchLater.length > 0 && (
                  <>
                    <Link
                      to={`/video/${watchLater[0]?.videoId}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-medium py-2.5 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <MdPlayArrow className="text-2xl" />
                      Play all
                    </Link>
                    <button className="flex items-center justify-center w-12 h-10 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
                      <MdShuffle className="text-xl" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Video List */}
          <div className="flex-1 min-w-0">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-4 mb-2 p-2 animate-pulse">
                  <div className="w-8 text-center text-white/50">{index + 1}</div>
                  <div className="w-[160px] h-[90px] bg-white/10 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : watchLater.length > 0 ? (
              watchLater.map((item, index) => (
                <div
                  key={item.videoId}
                  className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 group"
                >
                  {/* Number */}
                  <div className="w-8 text-center text-white/50 text-sm">{index + 1}</div>

                  {/* Thumbnail */}
                  <Link to={`/video/${item.videoId}`}>
                    <div className="relative w-[160px] h-[90px] rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      <img
                        className="h-full w-full object-cover"
                        src={item.thumbnail}
                        alt={item.title}
                      />
                      {item.duration && <VideoLength time={item.duration} />}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                        <MdPlayArrow className="text-white text-4xl" />
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/video/${item.videoId}`}>
                      <h3 className="text-white font-medium line-clamp-2 mb-1 hover:text-white/80">
                        {item.title}
                      </h3>
                    </Link>
                    <div className="flex items-center text-white/60 text-xs">
                      <span>{item.channelTitle}</span>
                      <BsFillCheckCircleFill className="text-[10px] ml-1" />
                      <span className="mx-1">•</span>
                      <span>{abbreviateNumber(item.views || 0, 1)} views</span>
                      {item.publishedTimeText && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{item.publishedTimeText}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.videoId)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-white/50">
                <MdWatchLater className="text-8xl mb-4 opacity-50" />
                <p className="text-xl font-medium mb-2">No videos in Watch Later</p>
                <p className="text-sm">Save videos to watch later</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
