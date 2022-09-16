import { SwiperSlide } from "swiper/react";
import FallbackImage from "../../components/fallback-image/FallbackImage";
import LazySwiper from "../../components/lazy-swiper/LazySwiper";

const CastList = ({ cast = [] }) => {
  return (
    <div className="casts">
      <LazySwiper
        slidesPerView="4.5"
        breakpoints={{
          600: {
            slidesPerView: 7.5,
          },
        }}
      >
        {cast.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="casts__item">
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
              <p className="casts__item__name">{item.name}</p>
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
