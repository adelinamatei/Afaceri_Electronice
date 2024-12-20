import { useState } from "react";
import Filters from "../components/Filters";
import Products from "../components/Products";
import DataSorting from "../components/DataSorting";

function Homepage() {
  const [filters, setFilters] = useState({
    category: "",
  });
  const [sorting, setSorting] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="homepageWrapper">
      <div className="filters-dataSorting-container">
        <Filters setFilters={setFilters} />
        <DataSorting setSorting={setSorting} />
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <Products filters={filters} sorting={sorting} />
    </div>
  );
}

export default Homepage;
