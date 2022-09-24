import { useEffect, useState, useRef } from "react";
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
import MediaApi from "../../api/backendApi/class/MediaApi";
import youtubeApi from "../../api/youtube/youtubeApi";
import GenreList from "./genre-list/GenreList";
import { toYoutubeVideoUrl } from "../../api/backendApi/helper";

const Detail = ({ itemType }) => {
  const { id } = useParams();
  const [item, setItem] = useState();
  const [credits, setCredits] = useState();
  const [seasons, setSeasons] = useState();
  const [trailers, setTrailers] = useState();
  const trailersRef = useRef();
  const seasonsRef = useRef();
  const backendApi = useBackendApi()[itemType];

  useEffect(() => {
    const getDetail = async () => {
      try {
        const { data } = await backendApi.getItem(id);
        setItem(data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.log(error);
      }
    };
    getDetail();
  }, [itemType, id, backendApi]);

  useEffect(() => {
    const getCredits = async () => {
      try {
        const { data } = await backendApi.getCredits(id);
        setCredits(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCredits();
  }, [itemType, id, backendApi]);

  useEffect(() => {
    const getSeasons = async () => {
      try {
        const { data } = await backendApi.getSeasons(id);
        setSeasons(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (itemType === MediaApi.itemType.show) getSeasons();
  }, [itemType, id, backendApi]);

  const handlePlay = () => {
    itemType === MediaApi.itemType.movie
      ? (window.location.href = item.videoUrl || "/")
      : scrollToRef(seasonsRef);
  };

  useEffect(() => {
    const getTrailers = async (ids) => {
      try {
        const videoData = (
          await Promise.allSettled(
            ids.map((id) => youtubeApi.getVideoDetail(id))
          )
        )
          .filter((r) => r.status === "fulfilled")
          .map((r, i) => toVideoModel({ ...r.value, id: ids[i] }));
        setTrailers(videoData);
      } catch (error) {
        console.log(error);
      }
    };
    item?.trailers?.length > 0 && getTrailers(item.trailers);
  }, [item, id]);

  return (
    <>
      <div
        className="banner"
        style={{
          backgroundImage: `url(${item?.backdropUrl})`,
        }}
      />
      <div className="mb-3 movie-content container">
        <div className="movie-content__poster">
          <div
            className="movie-content__poster__img"
            style={{
              backgroundImage: `url(${item?.posterUrl?.replace(
                "w500",
                "original"
              )})`,
            }}
          />
        </div>
        <div className="movie-content__info">
          <h1 className="title">{item?.title}</h1>
          <GenreList itemType={itemType} genres={item?.genres} />
          <p className="overview">{item?.overview}</p>
          <div className="cast">
            <div className="section__header">
              <h2>Casts</h2>
            </div>
            <CastList cast={credits?.cast} />
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
        {itemType === "show" && <SeasonList seasons={seasons} />}
        <div className="section mb-3" ref={trailersRef}>
          <div className="section__header mb-1">
            <h2>Trailers</h2>
          </div>
          <VideoList videos={trailers} />
        </div>
        <div className="section mb-3">
          <div className="section__header mb-1">
            <h2>Similar</h2>
          </div>
          <MovieList
            id={item?._id || id}
            itemType={itemType}
            listType={MediaApi.listType.similar}
          />
        </div>
      </div>
    </>
  );
};

const scrollToRef = (ref) => {
  ref.current.scrollIntoView({ behavior: "smooth" });
};

const toVideoModel = (v) => ({
  title: v.title,
  thumbnailUrl: v.thumbnails.standard.url,
  srcUrl: toYoutubeVideoUrl(v.id),
});

export default Detail;
