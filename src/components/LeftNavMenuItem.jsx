import PropTypes from "prop-types";

export default function LeftNavMenuItem({ text, icon, className, action }) {
  return (
    <div
      className={
        "text-white text-sm cursor-pointer h-10 flex items-center px-3 mb-[1px] transition-colors " +
        className
      }
      onClick={action}
    >
      <span className="text-xl mr-6">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

LeftNavMenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  className: PropTypes.string,
  action: PropTypes.func,
};

LeftNavMenuItem.defaultProps = {
  className: "",
  action: () => {},
};
