import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import { Navigation, Lazy, Mousewheel } from "swiper";
import SeasonCell from "./season-cell/SeasonCell";
import "swiper/swiper-bundle.css";
import "./SeasonList.scss";
import { episodeReleased } from "../../api/tmdb/tmdbApi.helper";
import LazySwiper from "../lazy-swiper/LazySwiper";
import { FormControl, MenuItem, Select } from "@mui/material";

const SeasonList = ({ seasons = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(endIndex(seasons));

  useEffect(() => {
    setSelectedIndex(endIndex(seasons));
  }, [seasons]);

  return (
    <div className="section mb-3">
      <div className="section__header mb-1">
        <FormControl size="small">
          <Select
            className="season-select"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            MenuProps={{
              classes: {
                root: "main-select-menu",
              },
            }}
          >
            {seasons?.map((s, i) => (
              <MenuItem key={s.title} value={i}>
                {s.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="season-list">
        <LazySwiper
          slidesPerView="1"
          breakpoints={{
            600: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          modules={[Navigation, Lazy, Mousewheel]}
        >
          {seasons[selectedIndex]?.episodes
            ?.filter(episodeReleased)
            .map((ep) => (
              <SwiperSlide key={ep.episodeNumber}>
                <SeasonCell item={ep} />
              </SwiperSlide>
            ))}
        </LazySwiper>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
    </div>
  );
};

const endIndex = (arr) => (arr && arr.length > 0 ? arr.length - 1 : "");

export default SeasonList;
