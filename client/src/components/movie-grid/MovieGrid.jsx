import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import "./movie-grid.scss";
import MovieCard from "../movie-card/MovieCard";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import tmdbApi from "../../api/tmdbApi";

const MovieGrid = (props) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const { query } = useParams();

  useEffect(() => {
    const getList = async () => {
      const response = query
        ? await tmdbApi.search(props.itemType, { params: { query: query } })
        : await tmdbApi.getItemList(props.itemType, props.category);
      console.log(`Movie grid response:`);
      console.log(response);
      setItems(response.docs);
      setTotalPage(response.total_pages);
    };
    getList();
  }, [props.category, props.itemType, query]);

  const loadMore = async () => {
    const response = query
      ? await tmdbApi.search(props.itemType, {
          params: { page: page + 1, query },
        })
      : await tmdbApi.getItemList(props.itemType, props.category, {
          params: { page: page + 1 },
        });
    console.log(`Movie grid loadmore:`);
    console.log(response);
    setItems([...items, ...response.docs]);
    setPage(page + 1);
  };

  return (
    <>
      <div className="section mb-3">
        <MovieSearch itemType={props.itemType} query={query} />
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

const MovieSearch = (props) => {
  const history = useHistory();
  const [query, setquery] = useState(props.query ? props.query : "");

  const goToSearch = useCallback(() => {
    if (query.trim().length > 0) {
      history.push(`/${props.itemType}/search/${query}`);
    }
  }, [query, props.itemType, history]);

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
