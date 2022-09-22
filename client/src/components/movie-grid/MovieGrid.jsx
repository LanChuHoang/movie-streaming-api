import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import "./movie-grid.scss";
import MovieCard from "../movie-card/MovieCard";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import useBackendApi from "../../hooks/useBackendApi";
import filterOptions from "../../api/filterOptions";
import { createSearchParams, useSearchParams } from "react-router-dom";
import MediaApi from "../../api/backendApi/MediaApi";
import { FormControl, MenuItem, Select } from "@mui/material";

const MovieGrid = ({ itemType, browseType }) => {
  const [items, setItems] = useState([]);
  const [loadedPages, setLoadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [params] = useSearchParams();
  const backendApi = useBackendApi()[itemType];

  const fetchItems = useCallback(
    async (browseType, params) => {
      try {
        const fields = MediaApi.briefInfoFields;
        return browseType === "search"
          ? (await backendApi.searchItems({ ...params, fields })).data
          : (await backendApi.getItems({ ...params, fields })).data;
      } catch (error) {
        throw error;
      }
    },
    [backendApi]
  );

  useEffect(() => {
    const loadNewItems = async () => {
      try {
        const parsedParams = parseParams(browseType, params);
        const { docs, totalPages } = await fetchItems(browseType, parsedParams);
        setItems(docs);
        setLoadedPages(1);
        setTotalPages(totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    browseType && loadNewItems();
  }, [itemType, browseType, params, fetchItems]);

  const handleLoadMore = async () => {
    try {
      const parsedParams = {
        ...parseParams(browseType, params),
        page: loadedPages + 1,
      };
      const { docs } = await fetchItems(browseType, parsedParams);
      setItems((prevItems) => [...prevItems, ...docs]);
      setLoadedPages((prevLoadedPages) => prevLoadedPages + 1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="search-filter-bar section mb-3">
        <FilterBar
          itemType={itemType}
          browseType={browseType}
          params={params}
        />
        <MovieSearch
          itemType={itemType}
          browseType={browseType}
          query={params.get("query")}
        />
      </div>
      <div className="movie-grid">
        {items.map((item, i) => (
          <MovieCard key={i} itemType={itemType} item={item} lazy={false} />
        ))}
      </div>
      {loadedPages < totalPages ? (
        <div className="movie-grid__loadmore">
          <OutlineButton className="small" onClick={handleLoadMore}>
            Load more
          </OutlineButton>
        </div>
      ) : null}
    </>
  );
};

const FilterBar = ({ itemType, browseType, params }) => {
  const navigate = useNavigate();

  const handleFilterChange = (key, value) => {
    const newParams =
      browseType === "browse"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams("");
    value ? newParams.set(key, value) : newParams.delete(key);
    navigate({
      pathname: `/${itemType}/browse`,
      search: `?${createSearchParams(newParams)}`,
    });
  };

  return (
    <div className="filter-bar-container">
      {fields(itemType).map((f) => (
        <FilterField
          key={f.paramName}
          value={params.get(f.paramName) || ""}
          onChange={handleFilterChange}
          {...f}
        />
      ))}
    </div>
  );
};

const fields = (itemType) => [
  {
    label: "Genres",
    options:
      itemType === "movie"
        ? filterOptions.movieGenres
        : filterOptions.showGenres,
    paramName: "genre",
  },
  { label: "Country", options: filterOptions.countries, paramName: "country" },
  { label: "Year", options: filterOptions.years, paramName: "year" },
  { label: "Sort By", options: filterOptions.sorts, paramName: "sort" },
];

const FilterField = ({ label, paramName, options, value = "", onChange }) => {
  return (
    <div className="filter-field-container">
      <label>{label}</label>
      <FormControl size="small">
        <Select
          className="movie-grid-select"
          value={value}
          onChange={(e) => onChange(paramName, e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          MenuProps={{
            classes: {
              root: "main-select-menu",
            },
          }}
        >
          {options?.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.display}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

const MovieSearch = ({ itemType, browseType, query: initialQuery }) => {
  const [query, setQuery] = useState(initialQuery ? initialQuery : "");
  const navigate = useNavigate();

  useEffect(() => {
    browseType !== "search" && setQuery("");
  }, [browseType]);

  const goToSearch = useCallback(
    (e) => {
      e && e.preventDefault();
      if (query.trim().length > 0) {
        navigate({
          pathname: `/${itemType}/search`,
          search: `?query=${query}`,
        });
      } else {
        navigate({
          pathname: `/${itemType}/browse`,
        });
      }
    },
    [query, itemType, navigate]
  );

  return (
    <div className="movie-search">
      <form onSubmit={goToSearch}>
        <Input
          type="text"
          placeholder="Enter query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <Button className="small" onClick={goToSearch}>
        Search
      </Button>
    </div>
  );
};

const parseParams = (browseType, urlSearchParams) => {
  const params = Object.fromEntries(urlSearchParams.entries());
  const acceptedFields =
    browseType === "browse" ? ["genre", "country", "year", "sort"] : ["query"];
  return acceptedFields.reduce(
    (result, acceptedField) => ({
      ...result,
      [acceptedField]: params[acceptedField],
    }),
    {}
  );
};

export default MovieGrid;
