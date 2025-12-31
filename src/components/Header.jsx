import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import ytLogo from "../assets/images/yt-logo.png";
import ytLogoMobile from "../assets/images/yt-logo-mobile.png";

import { SlMenu } from "react-icons/sl";
import { IoIosSearch } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";
import { FiBell } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import { MdHistory, MdLogout, MdFavorite, MdWatchLater } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

import { Context } from "../context/contextApi";
import Loader from "../shared/loader";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const {
    loading,
    mobileMenu,
    setMobileMenu,
    user,
    isAuthenticated,
    signOut,
    searchSuggestions,
    clearSearchSuggestions,
  } = useContext(Context);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageName = pathname?.split("/")?.filter(Boolean)?.[0];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchQuery = (event) => {
    if (
      (event?.key === "Enter" || event === "searchButton") &&
      searchQuery?.length > 0
    ) {
      navigate(`/searchResult/${searchQuery}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/searchResult/${suggestion}`);
    setShowSuggestions(false);
  };

  const mobileMenuToggle = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-20 flex flex-row items-center justify-between gap-3 overflow-visible h-14 px-1 md:px-5 bg-white dark:bg-black">
      {loading && <Loader />}

      {/* Left - Logo and Menu */}
      <div className="flex h-5 items-center gap-x-1">
        {pageName !== "video" && (
          <div
            className="flex md:hidden md:mr-6 cursor-pointer items-center justify-center h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]"
            onClick={mobileMenuToggle}
          >
            {mobileMenu ? (
              <CgClose className="text-white text-xl" />
            ) : (
              <SlMenu className="text-white text-xl" />
            )}
          </div>
        )}
        <Link to="/" className="flex h-5 items-center">
          <img
            className="h-full hidden dark:md:block md:block"
            src={ytLogo}
            alt="Youtube"
          />
          <img className="h-full md:hidden" src={ytLogoMobile} alt="Youtube" />
        </Link>
      </div>

      {/* Center - Search */}
      <div className="group flex items-center relative" ref={searchRef}>
        <div className="flex h-8 md:h-10 md:ml-10 md:pl-5 border border-[#303030] rounded-l-3xl group-focus-within:border-blue-500 md:group-focus-within:ml-5 md:group-focus-within:pl-0">
          <div className="w-10 items-center justify-center hidden group-focus-within:md:flex">
            <IoIosSearch className="text-white text-xl" />
          </div>
          <input
            type="text"
            className="bg-transparent outline-none text-white pr-5 pl-5 md:pl-0 w-44 md:group-focus-within:pl-0 md:w-64 lg:w-[500px]"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={handleSearchQuery}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search"
            value={searchQuery}
          />
        </div>
        <button
          className="w-[40px] md:w-[60px] h-8 md:h-10 flex items-center justify-center border border-l-0 border-[#303030] rounded-r-3xl bg-white/[0.1]"
          onClick={() => handleSearchQuery("searchButton")}
        >
          <IoIosSearch className="text-white text-xl" />
        </button>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#212121] rounded-lg shadow-lg overflow-hidden z-50 md:ml-10">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <span className="text-white/50 text-xs">Recent searches</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSearchSuggestions();
                }}
                className="text-blue-400 text-xs hover:text-blue-300"
              >
                Clear all
              </button>
            </div>
            {searchSuggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
              >
                <MdHistory className="text-white/50" />
                <span className="text-sm">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right - Actions and Profile */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex">
          <div className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]">
            <RiVideoAddLine className="text-white text-xl cursor-pointer" />
          </div>
          <div className="flex items-center justify-center ml-2 h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]">
            <FiBell className="text-white text-xl cursor-pointer" />
          </div>
        </div>

        {/* User Profile / Sign In */}
        {isAuthenticated ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex h-8 w-8 md:h-9 md:w-9 overflow-hidden rounded-full md:ml-4 ring-2 ring-transparent hover:ring-white/30 transition-all"
            >
              {user?.photoURL ? (
                <img
                  className="h-full w-full object-cover"
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                />
              ) : (
                <div className="h-full w-full bg-red-600 flex items-center justify-center text-white font-bold">
                  {user?.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#212121] rounded-xl shadow-lg overflow-hidden z-50">
                {/* User Info */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {user?.photoURL ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.photoURL}
                        alt={user.displayName}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                        {user?.displayName?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-white font-medium truncate">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-white/50 text-sm truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/history"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                  >
                    <MdHistory className="text-xl" />
                    <span>Watch History</span>
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                  >
                    <MdFavorite className="text-xl" />
                    <span>Liked Videos</span>
                  </Link>
                  <Link
                    to="/watch-later"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                  >
                    <MdWatchLater className="text-xl" />
                    <span>Watch Later</span>
                  </Link>
                </div>

                {/* Sign Out */}
                <div className="py-2 border-t border-white/10">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                  >
                    <MdLogout className="text-xl" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-blue-400 text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors ml-2"
          >
            <FaUserCircle className="text-lg" />
            <span className="hidden md:inline text-sm font-medium">Sign In</span>
          </Link>
        )}
      </div>
    </div>
  );
}
