import { SwiperSlide } from "swiper/react";
import LazySwiper from "../../../components/lazy-swiper/LazySwiper";
import { Link } from "react-router-dom";
import "./mediaList.scss";
import PlayButton from "../../../components/buttons/play-button/PlayButton";
import Overlay from "../../../components/overlay/Overlay";
import { Navigation, Mousewheel } from "swiper";

const MediaList = ({ title, items, itemType }) => {
  return (
    <div className="media-list-container section mb-3">
      <div className="section__header mb-1">
        <h2>{title}</h2>
      </div>
      <div className="media-swiper-container">
        <LazySwiper
          slidesPerView="2"
          breakpoints={{
            600: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            1024: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
          }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          modules={[Navigation, Mousewheel]}
        >
          {items.map((item) => (
            <SwiperSlide key={item._id}>
              <MediaItem item={item} itemType={itemType} />
            </SwiperSlide>
          ))}
        </LazySwiper>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
    </div>
  );
};

const MediaItem = ({ item, itemType }) => (
  <Link key={item._id} to={`/${itemType}/${item._id}`}>
    <div className="media-item-container">
      <div className="thumbnail-container">
        <img
          loading="lazy"
          src={item.thumbnailUrl?.replace("w300", "w500")}
          alt={item.title}
        />
        <PlayButton />
      </div>
      <div className="media-title">{item.title}</div>
      <Overlay />
    </div>
  </Link>
);

export default MediaList;
