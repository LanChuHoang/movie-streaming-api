import React from "react";
import { useParams } from "react-router";
import PageHeader from "../components/page-header/PageHeader";
import { itemType as type, movieCategory, showCategory } from "../api/tmdbApi";
import MovieGrid from "../components/movie-grid/MovieGrid";

const Catalog = () => {
  const { itemType } = useParams();

  return (
    <>
      <PageHeader>{itemType === type.movie ? "Movies" : "Shows"}</PageHeader>
      <div className="container">
        <div className="section mb-3">
          <MovieGrid
            itemType={itemType}
            category={
              itemType === type.movie ? movieCategory.none : showCategory.none
            }
          />
        </div>
      </div>
    </>
  );
};

export default Catalog;
