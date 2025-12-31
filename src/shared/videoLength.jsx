import moment from "moment";
import PropTypes from "prop-types";

const VideoLength = ({ time }) => {
  const videoLengthInSeconds = moment()
    ?.startOf("day")
    ?.seconds(time)
    ?.format("H:mm:ss");

  // Remove leading zero hour if present
  const formattedTime = videoLengthInSeconds.startsWith("0:")
    ? videoLengthInSeconds.substring(2)
    : videoLengthInSeconds;

  return (
    <span className="absolute bottom-2 right-2 bg-black/80 py-0.5 px-1.5 text-white text-xs rounded font-medium">
      {formattedTime}
    </span>
  );
};

VideoLength.propTypes = {
  time: PropTypes.number.isRequired,
};

export default VideoLength;
