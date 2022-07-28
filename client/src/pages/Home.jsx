import React from "react";
import { Link } from "react-router-dom";
import { OutlineButton } from "../components/button/Button";
import HeroSlide from "../components/hero-slide/HeroSlide";
import MovieList from "../components/movie-list/MovieList";
import { itemType, listType } from "../api/backendApi";

const Home = () => {
  return (
    <>
      <HeroSlide />
      <div className="container">
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Popular Movies</h2>
            <Link to="/movie/browse">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList itemType={itemType.movie} listType={listType.popular} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Lastest Movies</h2>
            <Link to="/movie/browse">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList itemType={itemType.movie} listType={listType.lastest} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Coming soon</h2>
            <Link to="/movie/browse">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList itemType={itemType.movie} listType={listType.upcoming} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Popular Show</h2>
            <Link to="/show/browse">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList itemType={itemType.show} listType={listType.popular} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Lastest Show</h2>
            <Link to="/show/browse">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList itemType={itemType.show} listType={listType.lastest} />
        </div>
      </div>
    </>
  );
};

export default Home;
