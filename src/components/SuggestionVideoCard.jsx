import { useContext } from "react";
import { Link } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { abbreviateNumber } from "js-abbreviation-number";
import PropTypes from "prop-types";

import { Context } from "../context/contextApi";
import VideoLength from "../shared/videoLength";

export default function SuggestionVideoCard({ video }) {
  const { isAuthenticated, saveToHistory } = useContext(Context);

  const handleClick = () => {
    if (isAuthenticated && video) {
      saveToHistory(video);
    }
  };

  return (
    <Link to={`/video/${video?.videoId}`} onClick={handleClick}>
      <div className="flex mb-2 hover:bg-white/5 rounded-xl p-1 -mx-1 transition-colors group">
        {/* Thumbnail */}
        <div className="relative w-[168px] min-w-[168px] h-[94px] rounded-lg overflow-hidden bg-white/5">
          <img
            className="h-full w-full object-cover"
            src={video?.thumbnails?.[0]?.url}
            alt={video?.title}
          />
          {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />}
        </div>

        {/* Video Info */}
        <div className="flex flex-col ml-2 overflow-hidden flex-1">
          <span className="text-white text-sm font-medium line-clamp-2 leading-5 group-hover:text-white/90">
            {video?.title}
          </span>
          
          <span className="text-white/60 text-xs mt-1 flex items-center">
            {video?.author?.title}
            {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
              <BsFillCheckCircleFill className="text-white/60 text-[10px] ml-1" />
            )}
          </span>
          
          <div className="flex text-white/60 text-xs mt-0.5">
            <span>{abbreviateNumber(video?.stats?.views || 0, 1)} views</span>
            <span className="mx-1">•</span>
            <span>{video?.publishedTimeText}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

SuggestionVideoCard.propTypes = {
  video: PropTypes.object.isRequired,
};
