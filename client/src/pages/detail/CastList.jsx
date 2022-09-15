import { Swiper, SwiperSlide } from "swiper/react";

const CastList = ({ cast = [] }) => {
  return (
    <div className="casts">
      <Swiper grabCursor={true} spaceBetween={10} slidesPerView="auto">
        {cast.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="casts__item">
              <img src={item.avatarUrl} alt={item.name} />
              <p className="casts__item__name">{item.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CastList;
