import { AutocompleteAdminSearchBar } from "../search-bar/AdminSearchBar";
import "./adminImportBar.scss";
import { useState, useMemo, useCallback, useEffect } from "react";
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
  const [query, setQuery] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const navigate = useNavigate();

  const fetchItems = useMemo(
    () => throttle((params) => searchItems(params)),
    [searchItems]
  );

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = (await fetchItems({ query, page })).data;
        const items = response.results || [];
        page === 1
          ? setItems(items)
          : setItems((prevItems) => [...prevItems, ...items]);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.log(error);
      }
    };
    if (query && page) loadItems();
  }, [query, page, fetchItems]);

  const handleInputChange = useCallback(
    (inputValue) => {
      if (!inputValue) {
        setItems([]);
        return;
      }
      if (page !== 1) setPage(1);
      setQuery(inputValue);
    },
    [page]
  );

  const handleLoadMore = useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages]);

  const renderResults = useCallback(
    (props, option) => (
      <li
        {...props}
        key={option.id}
        onClick={(e) => {
          props.onClick(e);
          onItemSelect(option);
        }}
      >
        {renderOption(option)}
      </li>
    ),
    [onItemSelect, renderOption]
  );

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
        onLoadMore={handleLoadMore}
        getOptionLabel={getOptionLabel}
        renderOption={renderResults}
      />
    </div>
  );
};

export default AdminImportBar;
