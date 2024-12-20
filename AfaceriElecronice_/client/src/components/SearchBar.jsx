import { useState } from "react";

const SearchBar = ({ setSearchQuery }) => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
    setSearchQuery(searchQuery);
  };

  return (
    <div className="searchWrapper">
      <label htmlFor="searchQuery">Search by Title or Author</label>
      <input
        type="text"
        id="searchQuery"
        value={query}
        onChange={handleSearchChange}
        placeholder="Enter title or author"
      />
    </div>
  );
};

export default SearchBar;
