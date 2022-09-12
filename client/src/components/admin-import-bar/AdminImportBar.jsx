import { AutocompleteAdminSearchBar } from "../search-bar/AdminSearchBar";
import "./adminImportBar.scss";
import { useState, useMemo } from "react";
import { throttle } from "lodash";
import { useNavigate } from "react-router-dom";

const AdminImportBar = ({
  title,
  searchItems,
  getOptionLabel,
  renderOption,
  onItemSelect,
}) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const fetchItems = useMemo(
    () => throttle((params) => searchItems(params)),
    [searchItems]
  );

  const handleInputChange = async (inputValue) => {
    if (!inputValue) {
      setItems([]);
      return;
    }
    const response = (await fetchItems({ query: inputValue })).data;
    setItems(response.results || []);
  };

  const handleItemSelect = (item) => {
    onItemSelect(item);
  };

  return (
    <div className="admin-import-bar-container">
      <div className="admin-import-bar-title-wrapper">
        <button type="button" onClick={() => navigate(-1)}>
          <i className="bx bx-chevron-left"></i>
        </button>
        <h1>{title}</h1>
      </div>
      <AutocompleteAdminSearchBar
        placeholder="Search on TMDB"
        options={items}
        onInputChange={handleInputChange}
        getOptionLabel={getOptionLabel}
        renderOption={(props, option) => {
          return (
            <li
              {...props}
              key={option.id}
              onClick={(e) => {
                props.onClick(e);
                handleItemSelect(option);
              }}
            >
              {renderOption(option)}
            </li>
          );
        }}
      />
    </div>
  );
};

export default AdminImportBar;
