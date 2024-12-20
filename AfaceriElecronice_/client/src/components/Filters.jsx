import { useEffect, useState } from "react";
import { getBookCategories } from "../routes/products";

const Filters = (props) => {
  const { setFilters } = props;
  const [categories, setCategories] = useState([]);

  const handleGetBookCategories = async () => {
    const response = await getBookCategories();
    setCategories(["All", ...response]);  
  };

  const handleCategoryChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: event.target.value === "All" ? "" : event.target.value,
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getBookCategories();
      setCategories(["All", ...categories]); 
    };
  
    if (!categories.length) {
      fetchCategories();
    }
  }, []);
  

  return (
    <div className="filtersWrapper">
      <label htmlFor="categorySelect">Category</label>
      <select id="categorySelect" onChange={handleCategoryChange}>
        {categories?.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;