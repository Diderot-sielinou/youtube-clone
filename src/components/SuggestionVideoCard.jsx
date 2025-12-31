import { useContext } from "react";
import { abbreviateNumber } from "js-abbreviation-number";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import VideoLength from "../shared/videoLength";
import { Context } from "../context/contextApi";

export default function SuggestionVideoCard({ video }) {
  const { isAuthenticated, saveToHistory } = useContext(Context);

  const handleClick = () => {
    // Save to history when clicking on suggestion
    if (isAuthenticated && video) {
      saveToHistory(video);
    }
  };

  return (
    <Link to={`/video/${video?.videoId}`} onClick={handleClick}>
      <div className="flex mb-3 group">
        <div className="relative h-24 lg:h-20 xl:h-24 w-40 min-w-[168px] lg:w-32 lg:min-w-[128px] xl:w-40 xl:min-w-[168px] rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={video?.thumbnails?.[0]?.url}
            alt={video?.title}
          />
          {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />}
        </div>
        <div className="flex flex-col ml-3 overflow-hidden">
          <span className="text-sm lg:text-xs xl:text-sm font-bold line-clamp-2 text-white group-hover:text-red-500 transition-colors">
            {video?.title}
          </span>
          <span className="text-[12px] lg:text-[10px] xl:text-[12px] font-semibold mt-2 text-white/[0.7] flex items-center">
            {video?.author?.title}
            {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
              <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] lg:text-[10px] xl:text-[12px] ml-1" />
            )}
          </span>
          <div className="flex text-[12px] lg:text-[10px] xl:text-[12px] font-semibold text-white/[0.7] truncate overflow-hidden">
            <span>{`${abbreviateNumber(video?.stats?.views || 0, 2)} views`}</span>
            <span className="flex text-[24px] leading-none font-bold text-white/[0.7] relative top-[-10px] mx-1">
              .
            </span>
            <span className="truncate">{video?.publishedTimeText}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

SuggestionVideoCard.propTypes = {
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
  }),
};
