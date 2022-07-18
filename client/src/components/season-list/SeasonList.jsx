import { useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation } from "swiper";
import SeasonCell from "../season-cell/SeasonCell";
import "swiper/swiper-bundle.css";
import "./SeasonList.scss";

const SeasonList = (props) => {
  const [seasonNumber, setSeasonNumber] = useState(props.seasons.length - 1);

  return (
    <div className="section mb-3">
      <div className="section__header mb-2">
        <select
          className="season-select"
          value={seasonNumber}
          onChange={(e) => setSeasonNumber(e.target.value)}
        >
          Seasons
          {props.seasons.map((s, i) => (
            <option value={i} key={i}>
              {"Season " + s.seasonNumber}
            </option>
          ))}
        </select>
      </div>
      <div className="season-list">
        <Swiper
          grabCursor={true}
          spaceBetween={10}
          slidesPerView={4}
          navigation={true}
          modules={[Navigation]}
        >
          {props.seasons[seasonNumber]?.episodes
            .filter((ep) => ep.thumbnailUrl)
            .map((ep, i) => (
              <SwiperSlide key={i}>
                <SeasonCell item={ep} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SeasonList;
