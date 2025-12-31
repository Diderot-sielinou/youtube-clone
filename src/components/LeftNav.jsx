import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Context } from "../context/contextApi";
import LeftNavMenuItem from "./LeftNavMenuItem";

import { AiFillHome, AiOutlineFlag } from "react-icons/ai";
import { MdLocalFireDepartment, MdLiveTv, MdHistory, MdWatchLater } from "react-icons/md";
import { CgMusicNote } from "react-icons/cg";
import { FiFilm } from "react-icons/fi";
import { IoGameControllerSharp } from "react-icons/io5";
import { ImNewspaper } from "react-icons/im";
import { GiDiamondTrophy, GiEclipse } from "react-icons/gi";
import { RiLightbulbLine, RiFeedbackLine } from "react-icons/ri";
import { FiSettings, FiHelpCircle } from "react-icons/fi";
import { MdFavorite } from "react-icons/md";

export default function LeftNav() {
  const categories = [
    { name: "New", icon: <AiFillHome />, type: "home" },
    { name: "Trending", icon: <MdLocalFireDepartment />, type: "category" },
    { name: "Music", icon: <CgMusicNote />, type: "category" },
    { name: "Films", icon: <FiFilm />, type: "category" },
    { name: "Live", icon: <MdLiveTv />, type: "category" },
    { name: "Gaming", icon: <IoGameControllerSharp />, type: "category" },
    { name: "News", icon: <ImNewspaper />, type: "category" },
    { name: "Sports", icon: <GiDiamondTrophy />, type: "category" },
    { name: "Learning", icon: <RiLightbulbLine />, type: "category" },
    {
      name: "Fashion & beauty",
      icon: <GiEclipse />,
      type: "category",
      divider: true,
    },
  ];

  const userMenuItems = [
    { name: "History", icon: <MdHistory />, type: "link", path: "/history" },
    { name: "Liked Videos", icon: <MdFavorite />, type: "link", path: "/favorites" },
    { name: "Watch Later", icon: <MdWatchLater />, type: "link", path: "/watch-later", divider: true },
  ];

  const footerMenuItems = [
    { name: "Settings", icon: <FiSettings />, type: "menu" },
    { name: "Report History", icon: <AiOutlineFlag />, type: "menu" },
    { name: "Help", icon: <FiHelpCircle />, type: "menu" },
    { name: "Send feedback", icon: <RiFeedbackLine />, type: "menu" },
  ];

  const { selectCategories, setSelectedCategories, mobileMenu, isAuthenticated, setMobileMenu } =
    useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const clickHandler = (name, type, path) => {
    // Close mobile menu after click
    if (window.innerWidth < 768) {
      setMobileMenu(false);
    }

    switch (type) {
      case "category":
        setSelectedCategories(name);
        navigate("/");
        break;
      case "home":
        setSelectedCategories(name);
        navigate("/");
        break;
      case "link":
        navigate(path);
        break;
      case "menu":
        // Handle menu items (could open modals, etc.)
        break;
      default:
        break;
    }
  };

  const isActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.type === "home" || item.type === "category") {
      return location.pathname === "/" && selectCategories === item.name;
    }
    return false;
  };

  return (
    <div
      className={`md:block w-[240px] overflow-y-auto h-full py-4 bg-black absolute md:relative z-10 translate-x-[-240px] md:translate-x-[0] transition-all ${
        mobileMenu ? "translate-x-[0]" : ""
      }`}
    >
      <div className="flex px-5 flex-col">
        {/* Main Categories */}
        {categories.map((item, index) => (
          <div key={index}>
            <LeftNavMenuItem
              text={item.type === "home" ? "Home" : item.name}
              icon={item.icon}
              action={() => clickHandler(item.name, item.type)}
              className={isActive(item) ? "bg-white/[0.15]" : ""}
            />
            {item.divider && <hr className="my-5 border-white/[0.2]" />}
          </div>
        ))}

        {/* User Menu Items (only show if authenticated) */}
        {isAuthenticated && (
          <>
            <div className="mt-2 mb-2">
              <span className="text-white/50 text-xs font-medium px-3">LIBRARY</span>
            </div>
            {userMenuItems.map((item, index) => (
              <div key={`user-${index}`}>
                <LeftNavMenuItem
                  text={item.name}
                  icon={item.icon}
                  action={() => clickHandler(item.name, item.type, item.path)}
                  className={isActive(item) ? "bg-white/[0.15]" : ""}
                />
                {item.divider && <hr className="my-5 border-white/[0.2]" />}
              </div>
            ))}
          </>
        )}

        {/* Footer Menu Items */}
        {footerMenuItems.map((item, index) => (
          <div key={`footer-${index}`}>
            <LeftNavMenuItem
              text={item.name}
              icon={item.icon}
              action={() => clickHandler(item.name, item.type)}
              className=""
            />
          </div>
        ))}
      </div>

      <hr className="my-5 border-white/[0.2]" />

      {/* Footer */}
      <div className="px-5 text-white/50 text-xs">
        <p className="mb-2">YouTube Clone with Firebase</p>
        <p className="text-white/30">© 2024 Fonou Tech</p>
      </div>
    </div>
  );
}
