import React from "react";
import { useParams } from "react-router";
import PageHeader from "../components/page-header/PageHeader";
import { itemType as type } from "../api/backendApi";
import MovieGrid from "../components/movie-grid/MovieGrid";

const Catalog = () => {
  const { itemType } = useParams();

  return (
    <>
      <PageHeader>{itemType === type.movie ? "Movies" : "Shows"}</PageHeader>
      <div className="container">
        <div className="section mb-3">
          <MovieGrid itemType={itemType} />
        </div>
      </div>
    </>
  );
};

export default Catalog;
