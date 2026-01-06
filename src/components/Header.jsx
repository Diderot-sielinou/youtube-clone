import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { SlMenu } from "react-icons/sl";
import { IoIosSearch } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";
import { FiBell } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import { MdHistory, MdLogout, MdFavorite, MdWatchLater, MdOutlineMic } from "react-icons/md";
import { FaUserCircle, FaYoutube } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

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
    <div className="sticky top-0 z-20 flex flex-row items-center justify-between h-14 px-4 md:px-4 bg-[#0f0f0f]">
      {loading && <Loader />}

      {/* Left - Logo and Menu */}
      <div className="flex items-center gap-4">
        {pageName !== "video" && (
          <button
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/[0.1]"
            onClick={mobileMenuToggle}
          >
            {mobileMenu ? (
              <CgClose className="text-white text-xl" />
            ) : (
              <SlMenu className="text-white text-xl" />
            )}
          </button>
        )}
        <Link to="/" className="flex items-center gap-1">
          <FaYoutube className="text-red-600 text-3xl" />
          <span className="text-white text-xl font-semibold tracking-tighter hidden sm:block">
            YouTube
          </span>
        </Link>
      </div>

      {/* Center - Search */}
      <div className="flex items-center justify-center flex-1 max-w-[640px] mx-4" ref={searchRef}>
        <div className="flex w-full">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full h-10 bg-[#121212] border border-[#303030] rounded-l-full px-4 text-white text-base focus:outline-none focus:border-blue-500 placeholder-white/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={handleSearchQuery}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search"
              value={searchQuery}
            />
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#212121] rounded-lg shadow-lg overflow-hidden z-50">
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
          <button
            className="w-16 h-10 flex items-center justify-center border border-l-0 border-[#303030] rounded-r-full bg-white/[0.08] hover:bg-white/[0.15]"
            onClick={() => handleSearchQuery("searchButton")}
          >
            <IoIosSearch className="text-white text-xl" />
          </button>
        </div>
        
        {/* Mic Button */}
        <button className="hidden sm:flex ml-3 w-10 h-10 items-center justify-center bg-white/[0.1] rounded-full hover:bg-white/[0.15]">
          <MdOutlineMic className="text-white text-xl" />
        </button>
      </div>

      {/* Right - Actions and Profile */}
      <div className="flex items-center gap-1">
        {isAuthenticated ? (
          <>
            <button className="hidden md:flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/[0.1]">
              <RiVideoAddLine className="text-white text-2xl" />
            </button>
            <button className="hidden md:flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/[0.1] relative">
              <FiBell className="text-white text-xl" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                9+
              </span>
            </button>

            {/* User Profile */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex h-8 w-8 overflow-hidden rounded-full ring-2 ring-transparent hover:ring-white/30 transition-all"
              >
                {user?.photoURL ? (
                  <img
                    className="h-full w-full object-cover"
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                  />
                ) : (
                  <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white font-medium">
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#282828] rounded-xl shadow-lg overflow-hidden z-50">
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
                        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
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
                      className="flex items-center gap-4 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                    >
                      <MdHistory className="text-xl" />
                      <span className="text-sm">History</span>
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-4 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                    >
                      <MdFavorite className="text-xl" />
                      <span className="text-sm">Liked videos</span>
                    </Link>
                    <Link
                      to="/watch-later"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-4 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                    >
                      <MdWatchLater className="text-xl" />
                      <span className="text-sm">Watch Later</span>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="py-2 border-t border-white/10">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-4 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                    >
                      <MdLogout className="text-xl" />
                      <span className="text-sm">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button className="hidden md:flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/[0.1]">
              <BsThreeDotsVertical className="text-white text-xl" />
            </button>
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-1.5 border border-[#3ea6ff] text-[#3ea6ff] hover:bg-[#3ea6ff]/10 rounded-full transition-colors ml-2"
            >
              <FaUserCircle className="text-xl" />
              <span className="text-sm font-medium">Sign in</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
