import React, { useState } from "react";
import PropTypes from "prop-types";

const Search = ({ data, keysToSearch, onFilteredData }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setQuery(value);
    const filtered = data.filter((item) =>
      keysToSearch.some((key) =>
        String(item[key]).toLowerCase().includes(value)
      )
    );
    onFilteredData(filtered);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar..."
        className="search-input"
      />
    </div>
  );
};

Search.propTypes = {
  data: PropTypes.array.isRequired,
  keysToSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilteredData: PropTypes.func.isRequired,
};

export default Search;