import { useState, useEffect, createContext } from "react";
import { fetchDataFromApi } from "../utils/api";
import PropTypes from "prop-types";

export const Context = createContext();

export const AppContext = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectCategories, setSelectedCategories] = useState("New");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    handleSelectCategorieData(selectCategories);
  }, [selectCategories]);

  const handleSelectCategorieData = (query) => {
    setLoading(true);
    fetchDataFromApi(`search/?q=${query}`).then(({contents}) => {
      console.log(contents);
      setSearchResults(contents)
      setLoading(false);
    });
  };

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        searchResults,
        setSearchResults,
        selectCategories,
        setSelectedCategories,
        mobileMenu,
        setMobileMenu,
      }}
    >
      {children}
    </Context.Provider>
  );
};

AppContext.propTypes = {
  children: PropTypes.node,
};
