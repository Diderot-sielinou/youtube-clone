import { useState, useEffect, createContext, useCallback } from "react";
import PropTypes from "prop-types";
import { fetchDataFromApi } from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { useFirestore } from "../hooks/useFirestore";

export const Context = createContext();

export const AppContext = ({ children }) => {
  // Auth state from custom hook
  const auth = useAuth();

  // Firestore operations
  const firestore = useFirestore(auth.user?.uid);

  // App state
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectCategories, setSelectedCategories] = useState("New");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // Load recommended category on user login
  useEffect(() => {
    const loadRecommendedCategory = async () => {
      if (auth.user?.uid) {
        const recommendedCategory = await firestore.getRecommendedCategory();
        if (recommendedCategory && recommendedCategory !== "New") {
          setSelectedCategories(recommendedCategory);
        }
      }
    };

    loadRecommendedCategory();
  }, [auth.user?.uid]);

  // Fetch data when category changes
  useEffect(() => {
    handleSelectCategorieData(selectCategories);
  }, [selectCategories]);

  // Load search suggestions when user logs in
  useEffect(() => {
    const loadSearchSuggestions = async () => {
      if (auth.user?.uid) {
        const history = await firestore.fetchSearchHistory();
        setSearchSuggestions(history);
      } else {
        setSearchSuggestions([]);
      }
    };

    loadSearchSuggestions();
  }, [auth.user?.uid]);

  const handleSelectCategorieData = useCallback(async (query) => {
    setLoading(true);
    try {
      const { contents } = await fetchDataFromApi(`search/?q=${query}`);
      setSearchResults(contents || []);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setSearchResults([]);
    }
    setLoading(false);
  }, []);

  // Enhanced search with history saving
  const handleSearch = useCallback(
    async (query) => {
      if (!query?.trim()) return;

      setLoading(true);

      // Save to search history if user is logged in
      if (auth.user?.uid) {
        await firestore.saveSearchQuery(query);
        // Update suggestions
        const history = await firestore.fetchSearchHistory();
        setSearchSuggestions(history);
      }

      try {
        const { contents } = await fetchDataFromApi(`search/?q=${query}`);
        setSearchResults(contents || []);
      } catch (error) {
        console.error("Error searching:", error);
      }

      setLoading(false);
    },
    [auth.user?.uid, firestore]
  );

  // Clear search suggestions
  const clearSearchSuggestions = useCallback(async () => {
    if (auth.user?.uid) {
      await firestore.deleteSearchHistory();
      setSearchSuggestions([]);
    }
  }, [auth.user?.uid, firestore]);

  return (
    <Context.Provider
      value={{
        // Auth
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        authLoading: auth.loading,
        googleSignIn: auth.googleSignIn,
        emailSignIn: auth.emailSignIn,
        emailSignUp: auth.emailSignUp,
        signOut: auth.signOut,

        // Firestore operations
        ...firestore,

        // App state
        loading,
        setLoading,
        searchResults,
        setSearchResults,
        selectCategories,
        setSelectedCategories,
        mobileMenu,
        setMobileMenu,

        // Search
        handleSearch,
        searchSuggestions,
        clearSearchSuggestions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

AppContext.propTypes = {
  children: PropTypes.node,
};

export default AppContext;
