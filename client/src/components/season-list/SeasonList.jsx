import { useEffect, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation } from "swiper";
import SeasonCell from "./season-cell/SeasonCell";
import "swiper/swiper-bundle.css";
import "./SeasonList.scss";
import { episodeReleased } from "../../api/tmdb/tmdbApi.helper";

const SeasonList = ({ seasons = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(endIndex(seasons));

  useEffect(() => {
    setSelectedIndex(endIndex(seasons));
  }, [seasons]);

  return (
    <div className="section mb-3">
      <div className="section__header mb-2">
        <select
          className="season-select"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
        >
          {seasons.map((s, i) => (
            <option value={i} key={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div className="season-list">
        <Swiper
          grabCursor={true}
          spaceBetween={10}
          slidesPerView="auto"
          navigation={true}
          modules={[Navigation]}
        >
          {seasons[selectedIndex]?.episodes
            ?.filter(episodeReleased)
            .map((ep) => (
              <SwiperSlide key={ep.episodeNumber}>
                <SeasonCell item={ep} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

const endIndex = (arr) => (arr && arr.length > 0 ? arr.length - 1 : 0);

export default SeasonList;
