import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import useBackendApi from "../../hooks/useBackendApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "./detail.scss";
import Button, { OutlineButton } from "../../components/button/Button";
import CastList from "./CastList";
import VideoList from "./VideoList";
import MovieList from "../../components/movie-list/MovieList";
import SeasonList from "../../components/season-list/SeasonList";
import { listType } from "../../api/backendApi";

const Detail = () => {
  const { itemType, id } = useParams();
  const [item, setItem] = useState(null);
  const trailersRef = useRef();
  const seasonsRef = useRef();
  const backendApi = useBackendApi();

  useEffect(() => {
    const getDetail = async () => {
      try {
        const { data } = await backendApi.getItemDetail(itemType, id);
        setItem(data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.log(error);
      }
    };
    getDetail();
  }, [itemType, id]);

  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const handlePlay = () => {
    itemType === "movie"
      ? (window.location.href = item.videoUrl || "/")
      : scrollToRef(seasonsRef);
  };

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
              <div className="buttons">
                <Button className="play-button" onClick={handlePlay}>
                  <FontAwesomeIcon icon={faPlay} />
                  Play
                </Button>
                <OutlineButton
                  className="trailer-button"
                  onClick={() => scrollToRef(trailersRef)}
                >
                  Trailers
                </OutlineButton>
              </div>
            </div>
          </div>
          <div className="container" ref={seasonsRef}>
            {itemType === "show" && <SeasonList seasons={item.seasons} />}
            <div className="section mb-3" ref={trailersRef}>
              <VideoList videos={item.trailers} />
            </div>
            <div className="section mb-3">
              <div className="section__header mb-2">
                <h2>Similar</h2>
              </div>
              <MovieList
                itemType={itemType}
                listType={listType.similar}
                id={item._id}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
