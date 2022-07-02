import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./movie-list.scss";
import { SwiperSlide, Swiper } from "swiper/react";
import tmdbApi from "../../api/tmdbApi";
import MovieCard from "../movie-card/MovieCard";

const MovieList = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getList = async () => {
      if (props.category !== "similar") {
        const response = await tmdbApi.getItemList(
          props.itemType,
          props.category
        );
        setItems(response.docs);
      } else {
        const response = await tmdbApi.getSimilarItem(props.itemType, props.id);
        setItems(response);
      }
    };
    getList();
  }, [props.itemType, props.category, props?.id]);

  return (
    <div className="movie-list">
      <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <MovieCard item={item} itemType={props.itemType} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

MovieList.propTypes = {
  category: PropTypes.string.isRequired,
  itemType: PropTypes.string.isRequired,
};

export default MovieList;
