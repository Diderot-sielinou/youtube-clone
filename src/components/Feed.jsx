import { useContext, useEffect } from "react";

import { Context } from "../context/contextApi";
import LeftNav from "./LeftNav";
import VideoCard from "./VideoCard";

export default function Feed() {
  const { loading, searchResults, selectCategories, isAuthenticated } = useContext(Context);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
  }, []);

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        {/* Category Header */}
        <div className="px-5 pt-5 pb-2">
          <h1 className="text-white text-xl font-bold">
            {selectCategories === "New" ? "Recommended" : selectCategories}
          </h1>
          {isAuthenticated && selectCategories !== "New" && (
            <p className="text-white/50 text-sm mt-1">
              Based on your preferences
            </p>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5 pt-2">
          {loading ? (
            // Loading Skeleton
            Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex flex-col mb-8 animate-pulse">
                <div className="h-48 md:h-40 md:rounded-xl bg-white/10" />
                <div className="flex mt-3">
                  <div className="h-9 w-9 rounded-full bg-white/10 flex-shrink-0" />
                  <div className="flex flex-col ml-3 flex-1">
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/10 rounded w-2/3 mt-2" />
                    <div className="h-3 bg-white/10 rounded w-1/2 mt-2" />
                  </div>
                </div>
              </div>
            ))
          ) : searchResults && searchResults.length > 0 ? (
            searchResults.map((item, index) => {
              if (!item?.video) return null;
              return <VideoCard key={item.video.videoId || index} video={item.video} />;
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/50">
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">No videos found</p>
              <p className="text-sm mt-1">Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
