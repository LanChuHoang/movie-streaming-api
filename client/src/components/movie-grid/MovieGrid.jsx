import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import "./movie-grid.scss";
import MovieCard from "../movie-card/MovieCard";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import useBackendApi from "../../hooks/useBackendApi";
import filterOptions from "../../api/filterOptions";
import { createSearchParams, useSearchParams } from "react-router-dom";

const MovieGrid = (props) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const { browseType } = useParams();
  const [params] = useSearchParams();
  const backendApi = useBackendApi();

  useEffect(() => {
    const getItems = async () => {
      try {
        let data;
        if (browseType === "search") {
          data = (await backendApi.searchItems(props.itemType, params)).data;
        } else if (browseType === "browse") {
          data = (await backendApi.getItems(props.itemType, params)).data;
        }
        setItems(data.docs);
        setTotalPage(data.total_pages);
      } catch (error) {
        console.log(error);
      }
    };
    browseType && getItems();
  }, [props.itemType, browseType, params]);

  const loadMore = async () => {
    try {
      let data;
      const urlSearchParams = new URLSearchParams(params.toString());
      urlSearchParams.set("page", page + 1);
      if (browseType === "search") {
        data = (await backendApi.searchItems(props.itemType, urlSearchParams))
          .data;
      } else if (browseType === "browse") {
        data = (await backendApi.getItems(props.itemType, urlSearchParams))
          .data;
      }
      setItems([...items, ...data.docs]);
      setPage(page + 1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="search-filter-bar section mb-3">
        <FilterBar itemType={props.itemType} />
        <MovieSearch itemType={props.itemType} query={params.get("query")} />
      </div>
      <div className="movie-grid">
        {items.map((item, i) => (
          <MovieCard itemType={props.itemType} item={item} key={i} />
        ))}
      </div>
      {page < totalPage ? (
        <div className="movie-grid__loadmore">
          <OutlineButton className="small" onClick={loadMore}>
            Load more
          </OutlineButton>
        </div>
      ) : null}
    </>
  );
};

const FilterField = (props) => {
  return (
    <div className="filter-field">
      <label>{props.label}</label>
      <select
        onChange={(e) => {
          props.onChange(props.paramName, e.target.value);
        }}
        value={props.value}
      >
        {props.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.display}
          </option>
        ))}
      </select>
    </div>
  );
};

const FilterBar = (props) => {
  const { browseType } = useParams();
  const [params, setParams] = useState(
    new URLSearchParams(browseType === "browse" ? window.location.search : "")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const currentParams = new URLSearchParams(
      browseType === "browse" ? window.location.search : ""
    );
    setParams(currentParams);
  }, [props.itemType]);

  const handleFilter = (key, value) => {
    const newParams = new URLSearchParams(
      browseType === "browse" ? window.location.search : ""
    );
    value ? newParams.set(key, value) : newParams.delete(key);
    setParams(newParams);
    navigate({
      pathname: `/${props.itemType}/browse`,
      search: `?${createSearchParams(newParams)}`,
    });
  };

  return (
    <div className="filter-bar">
      <FilterField
        label="Genre"
        options={
          props.itemType === "movie"
            ? filterOptions.movieGenres
            : filterOptions.showGenres
        }
        paramName="genre"
        onChange={handleFilter}
        value={params.get("genre") || ""}
      />
      <FilterField
        label="Country"
        options={filterOptions.countries}
        paramName="country"
        onChange={handleFilter}
        value={params.get("country") || ""}
      />
      <FilterField
        label="Year"
        options={filterOptions.years}
        paramName="year"
        onChange={handleFilter}
        value={params.get("year") || ""}
      />
      <FilterField
        label="Sort By"
        options={filterOptions.sorts}
        paramName="sort"
        onChange={handleFilter}
        value={params.get("sort") || ""}
      />
    </div>
  );
};

const MovieSearch = (props) => {
  const navigate = useNavigate();
  const [query, setquery] = useState(props.query ? props.query : "");

  const goToSearch = useCallback(() => {
    if (query.trim().length > 0) {
      navigate({
        pathname: `/${props.itemType}/search`,
        search: `?query=${query}`,
      });
    }
  }, [query, props.itemType, navigate]);

  useEffect(() => {
    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        goToSearch();
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [query, goToSearch]);

  return (
    <div className="movie-search">
      <Input
        type="text"
        placeholder="Enter query"
        value={query}
        onChange={(e) => setquery(e.target.value)}
      />
      <Button className="small" onClick={goToSearch}>
        Search
      </Button>
    </div>
  );
};

export default MovieGrid;
