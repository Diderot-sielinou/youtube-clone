import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { fetchDataFromApi } from "../utils/api";
import { Context } from "../context/contextApi";
import LeftNav from "./LeftNav";
import SearchResultVideoCard from "./SearchResultVideoCard";

export default function SearchResult() {
  const [result, setResult] = useState();
  const [localLoading, setLocalLoading] = useState(true);
  const { searchQuery } = useParams();
  const { setLoading, saveSearchQuery, isAuthenticated } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
    fetchSearchResults();
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setLocalLoading(true);

    // Save search query to history if authenticated
    if (isAuthenticated) {
      await saveSearchQuery(searchQuery);
    }

    try {
      const res = await fetchDataFromApi(`search/?q=${searchQuery}`);
      console.log(res);
      setResult(res?.contents);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResult([]);
    }

    setLoading(false);
    setLocalLoading(false);
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        {/* Search Header */}
        <div className="px-5 pt-5 pb-2 border-b border-white/10">
          <p className="text-white/50 text-sm">
            {localLoading
              ? "Searching..."
              : `${result?.filter((item) => item?.type === "video").length || 0} results for`}
          </p>
          <h1 className="text-white text-xl font-bold mt-1">"{searchQuery}"</h1>
        </div>

        {/* Results */}
        <div className="p-5">
          {localLoading ? (
            // Loading Skeleton
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex gap-4 animate-pulse">
                  <div className="w-40 h-24 md:w-48 md:h-28 rounded-lg bg-white/10 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-1/2 mt-2" />
                    <div className="h-3 bg-white/10 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : result?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {result?.map((item) => {
                if (item?.type !== "video") return null;
                return (
                  <SearchResultVideoCard
                    key={item.video.videoId}
                    video={item.video}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
