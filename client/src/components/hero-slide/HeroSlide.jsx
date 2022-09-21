import { useState, useEffect, useCallback } from "react";
import { Autoplay, Lazy, Mousewheel } from "swiper";
import { SwiperSlide } from "swiper/react";
import Button, { OutlineButton } from "../button/Button";
import "./hero-slide.scss";
import { useNavigate } from "react-router";
import useBackendApi from "../../hooks/useBackendApi";
import { toYoutubeVideoUrl } from "../../api/helper";
import LazySwiper from "../lazy-swiper/LazySwiper";
import TrailerModal from "../modals/trailer-modal/TrailerModal";

const HeroSlide = () => {
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
      <LazySwiper
        spaceBetween={0}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay, Lazy, Mousewheel]}
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
      </LazySwiper>
      <TrailerModal
        open={trailerOpen}
        onClose={handleTrailerClose}
        srcUrl={toYoutubeVideoUrl(selectedItem?.trailers?.[0])}
      />
    </div>
  );
};

const HeroSlideItem = ({ className, item, onOpenTrailerClick }) => {
  const navigate = useNavigate();

  return (
    <div className={`hero-slide__item ${className}`}>
      <div className="hero-slide__item__background">
        <img
          className="swiper-lazy"
          data-src={item.backdropUrl}
          alt={item.name}
        />
      </div>
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

export default HeroSlide;
