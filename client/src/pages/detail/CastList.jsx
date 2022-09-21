import { SwiperSlide } from "swiper/react";
import FallbackImage from "../../components/fallback-image/FallbackImage";
import LazySwiper from "../../components/lazy-swiper/LazySwiper";
import "./castList.scss";

const CastList = ({ cast = [] }) => {
  return (
    <div className="cast-list-container">
      <LazySwiper
        spaceBetween={15}
        slidesPerView="5"
        breakpoints={{
          800: {
            slidesPerView: 6,
          },
          1024: {
            slidesPerView: 7,
          },
        }}
      >
        {cast.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="cast-item-container">
              <FallbackImage
                fallback={<DefaultProfileImage name={item.name} />}
                image={
                  <img
                    className="swiper-lazy"
                    data-src={item.avatarUrl}
                    alt={item.name}
                  />
                }
              />
              <div className="cast-description">
                <p className="cast-name">{item.name}</p>
                <p className="cast-character">{item.character}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </LazySwiper>
    </div>
  );
};

const DefaultProfileImage = ({ name }) => {
  return (
    <div className="default-profile-image">
      <p>
        {name
          ?.split(" ")
          .slice(0, 2)
          .map((w) => w[0].toUpperCase())
          .join("")}
      </p>
    </div>
  );
};

export default CastList;
