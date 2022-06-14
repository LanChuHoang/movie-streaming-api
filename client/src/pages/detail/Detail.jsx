import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import tmdbApi from "../../api/tmdbApi";
import "./detail.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";
import MovieList from "../../components/movie-list/MovieList";

const Detail = () => {
  const { itemType, id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.getItemDetail(itemType, id);
      console.log(`Detail:`);
      console.log(response);
      setItem(response);
      window.scrollTo(0, 0);
    };
    getDetail();
  }, [itemType, id]);

  return (
    <>
      {item && (
        <>
          <div
            className="banner"
            style={{
              backgroundImage: `url(${item.backdropUrl})`,
            }}
          ></div>
          <div className="mb-3 movie-content container">
            <div className="movie-content__poster">
              <div
                className="movie-content__poster__img"
                style={{
                  backgroundImage: `url(${item.posterUrl.replace(
                    "w185",
                    "w500"
                  )})`,
                }}
              ></div>
            </div>
            <div className="movie-content__info">
              <h1 className="title">{item.title}</h1>
              <div className="genres">
                {item.genres &&
                  item.genres.slice(0, 5).map((genre, i) => (
                    <span key={i} className="genres__item">
                      {genre}
                    </span>
                  ))}
              </div>
              <p className="overview">{item.overview}</p>
              <div className="cast">
                <div className="section__header">
                  <h2>Casts</h2>
                </div>
                <CastList cast={item.cast} />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="section mb-3">
              <VideoList videos={item.trailers} />
            </div>
            <div className="section mb-3">
              <div className="section__header mb-2">
                <h2>Similar</h2>
              </div>
              <MovieList itemType={itemType} category="similar" id={item._id} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
