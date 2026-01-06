import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Context } from "../context/contextApi";
import LeftNavMenuItem from "./LeftNavMenuItem";

import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import {
  MdOutlineSubscriptions,
  MdSubscriptions,
  MdHistory,
  MdWatchLater,
  MdOutlineWatchLater,
  MdPlaylistPlay,
  MdOutlineVideoLibrary,
  MdVideoLibrary,
  MdOutlinedFlag,
  MdHelpOutline,
  MdOutlineFeedback,
} from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import {
  BiLike,
  BiSolidLike,
  BiTrendingUp,
  BiMusic,
  BiMovie,
  BiNews,
} from "react-icons/bi";
import { IoGameControllerOutline, IoSettingsOutline } from "react-icons/io5";
import { GiTrophyCup } from "react-icons/gi";
import { FaYoutube, FaRegLightbulb } from "react-icons/fa";
import { SiYoutubemusic, SiYoutubekids } from "react-icons/si";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiLiveLine } from "react-icons/ri";
import { FiRadio } from "react-icons/fi";
import { BsCollectionPlay, BsPlusCircle } from "react-icons/bs";

export default function LeftNav() {
  const {
    selectCategories,
    setSelectedCategories,
    mobileMenu,
    isAuthenticated,
    setMobileMenu,
  } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  // Main navigation items
  const mainNavItems = [
    { name: "Home", icon: <AiOutlineHome />, activeIcon: <AiFillHome />, type: "home", category: "New" },
    { name: "Shorts", icon: <SiYoutubeshorts />, type: "category", category: "Shorts" },
    { name: "Subscriptions", icon: <MdOutlineSubscriptions />, activeIcon: <MdSubscriptions />, type: "menu", requiresAuth: true },
  ];

  // User section - "You" or "Vous"
  const userSectionItems = [
    { name: "Your channel", icon: <BsCollectionPlay />, type: "menu", requiresAuth: true },
    { name: "History", icon: <MdHistory />, type: "link", path: "/history" },
    { name: "Playlists", icon: <MdPlaylistPlay />, type: "menu", requiresAuth: true },
    { name: "Your videos", icon: <MdOutlineVideoLibrary />, activeIcon: <MdVideoLibrary />, type: "menu", requiresAuth: true },
    { name: "Watch Later", icon: <MdOutlineWatchLater />, activeIcon: <MdWatchLater />, type: "link", path: "/watch-later" },
    { name: "Liked videos", icon: <BiLike />, activeIcon: <BiSolidLike />, type: "link", path: "/favorites" },
  ];

  // Subscriptions section (mock channels)
  const subscriptionChannels = [
    { name: "Lofi Girl", avatar: "https://yt3.ggpht.com/HLUxJlfYcKUaUzVVzWqMFy3NLJvCwCjXFNQ6JMGvKsXEnSoJLwhgM_t5T6JWfLPCOd1P3KkvYA=s68-c-k-c0x00ffffff-no-rj" },
    { name: "MrBeast", avatar: "https://yt3.ggpht.com/ytc/AIdro_mKeuMdalqkVCSL5T4OhHY8bJk1mTsHZ1bSrkRi6y1CDHY=s68-c-k-c0x00ffffff-no-rj" },
    { name: "Fireship", avatar: "https://yt3.ggpht.com/ytc/AIdro_nJF6SIlUBqXS6kDvbeSJMF2Ld98vX8z4gy9wG2Pg=s68-c-k-c0x00ffffff-no-rj" },
    { name: "Traversy Media", avatar: "https://yt3.ggpht.com/ytc/AIdro_mWCQH6dZrvlB8DQ4cZPY5y7Z7DLO_lGP5k1p6v8Q=s68-c-k-c0x00ffffff-no-rj" },
  ];

  // Explore section
  const exploreItems = [
    { name: "Trending", icon: <BiTrendingUp />, type: "category", category: "Trending" },
    { name: "Shopping", icon: <HiOutlineShoppingBag />, type: "category", category: "Shopping" },
    { name: "Music", icon: <BiMusic />, type: "category", category: "Music" },
    { name: "Movies", icon: <BiMovie />, type: "category", category: "Films" },
    { name: "Live", icon: <RiLiveLine />, type: "category", category: "Live" },
    { name: "Gaming", icon: <IoGameControllerOutline />, type: "category", category: "Gaming" },
    { name: "News", icon: <BiNews />, type: "category", category: "News" },
    { name: "Sports", icon: <GiTrophyCup />, type: "category", category: "Sports" },
    { name: "Learning", icon: <FaRegLightbulb />, type: "category", category: "Learning" },
    { name: "Podcasts", icon: <FiRadio />, type: "category", category: "Podcasts" },
  ];

  // More from YouTube section
  const moreFromYouTube = [
    { name: "YouTube Premium", icon: <FaYoutube className="text-red-600" />, type: "external" },
    { name: "YouTube Studio", icon: <FaYoutube className="text-red-600" />, type: "external" },
    { name: "YouTube Music", icon: <SiYoutubemusic className="text-red-600" />, type: "external" },
    { name: "YouTube Kids", icon: <SiYoutubekids className="text-red-600" />, type: "external" },
  ];

  // Settings section
  const settingsItems = [
    { name: "Settings", icon: <IoSettingsOutline />, type: "menu" },
    { name: "Report history", icon: <MdOutlinedFlag />, type: "menu" },
    { name: "Help", icon: <MdHelpOutline />, type: "menu" },
    { name: "Send feedback", icon: <MdOutlineFeedback />, type: "menu" },
  ];

  const clickHandler = (name, type, path, category) => {
    if (window.innerWidth < 768) {
      setMobileMenu(false);
    }

    switch (type) {
      case "category":
        setSelectedCategories(category || name);
        navigate("/");
        break;
      case "home":
        setSelectedCategories(category || "New");
        navigate("/");
        break;
      case "link":
        navigate(path);
        break;
      case "menu":
      case "external":
        break;
      default:
        break;
    }
  };

  const isActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.type === "home") {
      return location.pathname === "/" && selectCategories === (item.category || "New");
    }
    if (item.type === "category") {
      return location.pathname === "/" && selectCategories === (item.category || item.name);
    }
    return false;
  };

  return (
    <div
      className={`md:block w-[240px] overflow-y-auto h-full py-2 bg-[#0f0f0f] absolute md:relative z-10 translate-x-[-240px] md:translate-x-[0] transition-all scrollbar-thin scrollbar-thumb-gray-600 ${
        mobileMenu ? "translate-x-[0]" : ""
      }`}
    >
      <div className="flex flex-col">
        {/* Main Navigation */}
        <div className="px-3">
          {mainNavItems.map((item, index) => {
            if (item.requiresAuth && !isAuthenticated) return null;
            const active = isActive(item);
            return (
              <LeftNavMenuItem
                key={index}
                text={item.name}
                icon={active && item.activeIcon ? item.activeIcon : item.icon}
                action={() => clickHandler(item.name, item.type, null, item.category)}
                className={`${active ? "bg-white/[0.15] font-medium" : "hover:bg-white/[0.1]"} rounded-lg`}
              />
            );
          })}
        </div>

        <hr className="my-3 border-white/[0.15]" />

        {/* You Section */}
        <div className="px-3">
          <div className="flex items-center gap-1 px-3 py-1.5 mb-1">
            <span className="text-white text-base font-medium">You</span>
            <span className="text-white/70">›</span>
          </div>
          {userSectionItems.map((item, index) => {
            if (item.requiresAuth && !isAuthenticated) return null;
            const active = isActive(item);
            return (
              <LeftNavMenuItem
                key={`user-${index}`}
                text={item.name}
                icon={active && item.activeIcon ? item.activeIcon : item.icon}
                action={() => clickHandler(item.name, item.type, item.path)}
                className={`${active ? "bg-white/[0.15] font-medium" : "hover:bg-white/[0.1]"} rounded-lg`}
              />
            );
          })}
        </div>

        <hr className="my-3 border-white/[0.15]" />

        {/* Subscriptions Section */}
        {isAuthenticated && (
          <>
            <div className="px-3">
              <div className="px-3 py-1.5 mb-1">
                <span className="text-white text-base font-medium">Subscriptions</span>
              </div>
              {subscriptionChannels.map((channel, index) => (
                <div
                  key={`sub-${index}`}
                  className="flex items-center gap-6 px-3 py-2 cursor-pointer hover:bg-white/[0.1] rounded-lg"
                  onClick={() => {}}
                >
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${channel.name}&background=random`;
                    }}
                  />
                  <span className="text-white text-sm">{channel.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-6 px-3 py-2 cursor-pointer hover:bg-white/[0.1] rounded-lg">
                <BsPlusCircle className="text-white/70 text-xl ml-0.5" />
                <span className="text-white text-sm">Browse channels</span>
              </div>
            </div>
            <hr className="my-3 border-white/[0.15]" />
          </>
        )}

        {/* Explore Section */}
        <div className="px-3">
          <div className="px-3 py-1.5 mb-1">
            <span className="text-white text-base font-medium">Explore</span>
          </div>
          {exploreItems.map((item, index) => {
            const active = isActive(item);
            return (
              <LeftNavMenuItem
                key={`explore-${index}`}
                text={item.name}
                icon={item.icon}
                action={() => clickHandler(item.name, item.type, null, item.category)}
                className={`${active ? "bg-white/[0.15] font-medium" : "hover:bg-white/[0.1]"} rounded-lg`}
              />
            );
          })}
        </div>

        <hr className="my-3 border-white/[0.15]" />

        {/* More from YouTube */}
        <div className="px-3">
          <div className="px-3 py-1.5 mb-1">
            <span className="text-white text-base font-medium">More from YouTube</span>
          </div>
          {moreFromYouTube.map((item, index) => (
            <LeftNavMenuItem
              key={`more-${index}`}
              text={item.name}
              icon={item.icon}
              action={() => {}}
              className="hover:bg-white/[0.1] rounded-lg"
            />
          ))}
        </div>

        <hr className="my-3 border-white/[0.15]" />

        {/* Settings */}
        <div className="px-3">
          {settingsItems.map((item, index) => (
            <LeftNavMenuItem
              key={`settings-${index}`}
              text={item.name}
              icon={item.icon}
              action={() => {}}
              className="hover:bg-white/[0.1] rounded-lg"
            />
          ))}
        </div>

        <hr className="my-3 border-white/[0.15]" />

        {/* Footer Links */}
        <div className="px-6 py-2">
          <div className="flex flex-wrap gap-x-2 gap-y-0 text-[13px] text-white/50 font-medium mb-3">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Press</a>
            <a href="#" className="hover:text-white">Copyright</a>
            <a href="#" className="hover:text-white">Contact us</a>
            <a href="#" className="hover:text-white">Creators</a>
            <a href="#" className="hover:text-white">Advertise</a>
            <a href="#" className="hover:text-white">Developers</a>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-0 text-[13px] text-white/50 font-medium mb-4">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Policy & Safety</a>
            <a href="#" className="hover:text-white">How YouTube works</a>
            <a href="#" className="hover:text-white">Test new features</a>
          </div>
          <p className="text-xs text-white/40">© 2025 Google LLC</p>
        </div>
      </div>
    </div>
  );
}
