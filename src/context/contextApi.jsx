import { useState, useEffect, createContext } from "react";
import { fetchDataFromApi } from "../utils/api";
import PropTypes from "prop-types";
export const context = createContext();

export const AppContext = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(false);
  const [selecctCategories, setSelecctCategories] = useState("New");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    handleSelectCategorieData(selecctCategories);
  }, [selecctCategories]);

  const handleSelectCategorieData = (query) => {
    setLoading(true);
    fetchDataFromApi(`search/?q=${query}`).then((resp) => {
      console.log(resp);
      setLoading(false);
    });
  };

  return (
    <context.Provider
      value={{
        loading,
        setLoading,
        searchResults,
        setSearchResults,
        selecctCategories,
        setSelecctCategories,
        mobileMenu,
        setMobileMenu,
      }}
    >
      {children}
    </context.Provider>
  );
};

AppContext.propTypes = {
  children: PropTypes.node,
};
