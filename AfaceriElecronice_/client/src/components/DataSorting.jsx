import { sortingOptions } from "../constants/sort";

const DataSorting = (props) => {
  const { setSorting } = props;

  const handleSortingChange = (event) => {
    setSorting(Number(event.target.value));
  };

  return (
    <div className="dataSortingWrapper">
      <label htmlFor="categorySelect">Sort By</label>
      <select id="categorySelect" onChange={handleSortingChange}>
        {sortingOptions?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DataSorting;
