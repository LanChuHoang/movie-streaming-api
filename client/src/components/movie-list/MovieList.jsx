import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./movie-list.scss";
import { SwiperSlide, Swiper } from "swiper/react";
import useBackendApi from "../../hooks/useBackendApi";
import MovieCard from "../movie-card/MovieCard";
import { listType } from "../../api/backendApi";

const MovieList = (props) => {
  const [items, setItems] = useState([]);
  const backendApi = useBackendApi();

  useEffect(() => {
    const getList = async () => {
      try {
        if (props.listType !== listType.similar) {
          const { data } = await backendApi.getList(
            props.itemType,
            props.listType
          );
          setItems(data.docs);
        } else {
          const { data } = await backendApi.getSimilarItems(
            props.itemType,
            props.id
          );
          setItems(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getList();
  }, [props.itemType, props.listType, props?.id]);

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
  listType: PropTypes.string.isRequired,
  itemType: PropTypes.string.isRequired,
};

export default MovieList;
