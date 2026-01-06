import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { fetchDataFromApi } from "../utils/api";
import { Context } from "../context/contextApi";
import LeftNav from "./LeftNav";
import SearchResultVideoCard from "./SearchResultVideoCard";

export default function SearchResult() {
  const [result, setResult] = useState([]);
  const { searchQuery } = useParams();
  const { setLoading, loading, isAuthenticated, saveSearchQuery } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
    fetchSearchResults();
  }, [searchQuery]);

  const fetchSearchResults = () => {
    setLoading(true);
    fetchDataFromApi(`search/?q=${searchQuery}`).then((res) => {
      console.log("search result", res);
      setResult(res?.contents || []);
      setLoading(false);

      // Save search query if authenticated
      if (isAuthenticated && saveSearchQuery) {
        saveSearchQuery(searchQuery);
      }
    });
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-[#0f0f0f]">
        <div className="max-w-[1096px] mx-auto py-4 px-4 md:px-8">
          {/* Filter chips */}
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2 hide-scrollbar">
            {["All", "Videos", "Channels", "Playlists", "Live", "4K", "HDR"].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === "All"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex gap-4 mb-4 animate-pulse">
                <div className="w-[360px] h-[202px] bg-white/10 rounded-xl" />
                <div className="flex-1">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-white/10 rounded w-1/4 mb-3" />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full" />
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                  </div>
                  <div className="h-4 bg-white/10 rounded w-full" />
                </div>
              </div>
            ))
          ) : result && result.length > 0 ? (
            result.map((item, index) => {
              if (!item?.video) return null;
              return <SearchResultVideoCard key={item.video.videoId || index} video={item.video} />;
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <svg
                className="w-24 h-24 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-xl font-medium mb-2">No results found</p>
              <p className="text-sm">Try different keywords or check spelling</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
