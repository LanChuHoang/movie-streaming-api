import React from "react";
import { Link } from "react-router-dom";
import { OutlineButton } from "../components/button/Button";
import HeroSlide from "../components/hero-slide/HeroSlide";
import MovieList from "../components/movie-list/MovieList";
import { itemType, movieCategory, showCategory } from "../api/tmdbApi";

const Home = () => {
  return (
    <>
      <HeroSlide />
      <div className="container">
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Popular Movies</h2>
            <Link to="/movie">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList
            itemType={itemType.movie}
            category={movieCategory.popular}
          />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Lastest Movies</h2>
            <Link to="/movie">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList
            itemType={itemType.movie}
            category={movieCategory.lastest}
          />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Coming soon</h2>
            <Link to="/movie">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList
            itemType={itemType.movie}
            category={movieCategory.upcoming}
          />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Popular Show</h2>
            <Link to="/show">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList itemType={itemType.show} category={showCategory.popular} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Lastest Show</h2>
            <Link to="/show">
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList itemType={itemType.show} category={showCategory.lastest} />
        </div>
      </div>
    </>
  );
};

export default Home;
