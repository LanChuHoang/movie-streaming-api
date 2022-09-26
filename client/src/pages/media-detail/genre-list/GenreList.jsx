import { createSearchParams, Link } from "react-router-dom";
import { SwiperSlide } from "swiper/react";
import LazySwiper from "../../../components/lazy-swiper/LazySwiper";
import "./genreList.scss";

const GenreList = ({ itemType, genres = [] }) => {
  return (
    <div className="genre-list-container">
      <LazySwiper
        slidesPerView="auto"
        spaceBetween="4"
        breakpoints={{
          600: {
            spaceBetween: 6,
          },
          1024: {
            spaceBetween: 8,
          },
        }}
      >
        {genres.map((genre) => (
          <SwiperSlide key={genre}>
            <Link to={urlToGenre(itemType, genre)}>
              <div className="genre-item">{genre}</div>
            </Link>
          </SwiperSlide>
        ))}
      </LazySwiper>
    </div>
  );
};

const urlToGenre = (itemType, genre) => ({
  pathname: `/${itemType}/browse`,
  search: `?${createSearchParams({ genre })}`,
});

export default GenreList;
