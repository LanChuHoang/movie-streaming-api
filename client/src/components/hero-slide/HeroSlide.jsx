import { useState, useEffect, useCallback } from "react";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Button, { OutlineButton } from "../button/Button";
import "./hero-slide.scss";
import { useNavigate } from "react-router";
import useBackendApi from "../../hooks/useBackendApi";
import { Fade, Modal } from "@mui/material";

const HeroSlide = () => {
  SwiperCore.use([Autoplay]);
  const [movieItems, setMovieItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const backendApi = useBackendApi().movie;

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movies = (await backendApi.getRandomMovies(3)).data;
        console.log(movies.map((m) => m.title));
        setMovieItems(movies);
      } catch (error) {
        console.log(error);
      }
    };
    getMovies();
  }, [backendApi]);

  const handleTrailerOpen = useCallback((item) => {
    setSelectedItem({ ...item });
  }, []);

  useEffect(() => {
    if (selectedItem) setTrailerOpen(true);
  }, [selectedItem]);

  const handleTrailerClose = useCallback(() => {
    setTrailerOpen(false);
  }, []);

  return (
    <div className="hero-slide">
      <Swiper
        modules={[Autoplay]}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        // autoplay={{ delay: 3000 }}
      >
        {movieItems.map((item, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <HeroSlideItem
                className={`${isActive ? "active" : ""}`}
                item={item}
                onOpenTrailerClick={handleTrailerOpen}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <Modal
        open={trailerOpen}
        onClose={handleTrailerClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={trailerOpen}>
          <div className="trailer-modal">
            {selectedItem?.trailers?.length > 0 ? (
              <iframe
                width="100%"
                height="100%"
                title="trailer"
                allow="fullscreen"
                src={toYoutubeVideoUrl(selectedItem.trailers[0])}
              />
            ) : (
              <p>This movie has no trailer</p>
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

const HeroSlideItem = ({ className, item, onOpenTrailerClick }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`hero-slide__item ${className}`}
      style={{ backgroundImage: `url(${item.backdropUrl})` }}
    >
      <div className="hero-slide__item__content container">
        <div className="hero-slide__item__content__info">
          <h2 className="title">{item.title}</h2>
          <div className="overview">{item.overview}</div>
          <div className="btns">
            <Button onClick={() => navigate(`/movie/${item._id}/detail`)}>
              Watch now
            </Button>
            {item.trailers?.length > 0 && (
              <OutlineButton onClick={() => onOpenTrailerClick(item)}>
                Watch trailer
              </OutlineButton>
            )}
          </div>
        </div>
        <div className="hero-slide__item__content__poster">
          <img src={item.posterUrl?.replace("w185", "w500")} alt="" />
        </div>
      </div>
    </div>
  );
};

const toYoutubeVideoUrl = (path) =>
  path ? `https://www.youtube.com/embed/${path}` : undefined;

export default HeroSlide;
