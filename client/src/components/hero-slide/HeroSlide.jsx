import React, { useState, useEffect, useRef } from "react";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Button, { OutlineButton } from "../button/Button";
// import Modal, { ModalContent } from "../modals/modal/Modal";
import "./hero-slide.scss";
import { useNavigate } from "react-router";
import useBackendApi from "../../hooks/useBackendApi";

const HeroSlide = () => {
  SwiperCore.use([Autoplay]);
  const [movieItems, setMovieItems] = useState([]);
  const backendApi = useBackendApi();

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movies = await backendApi.getRandomMovies();
        setMovieItems(movies);
      } catch (error) {
        console.log(error);
      }
    };
    getMovies();
  }, []);

  return (
    <div className="hero-slide">
      <Swiper
        modules={[Autoplay]}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
      >
        {movieItems.map((item, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <HeroSlideItem
                item={item}
                className={`${isActive ? "active" : ""}`}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {/* {movieItems.map((item, i) => (
        <TrailerModal key={i} item={item} />
      ))} */}
    </div>
  );
};

const HeroSlideItem = (props) => {
  const navigate = useNavigate();
  const item = props.item;

  const setModalActive = async () => {
    const modal = document.querySelector(`#modal_${item._id}`);

    if (item.trailers.length > 0) {
      const videoSrc = "https://www.youtube.com/embed/" + item.trailers[0];
      modal
        .querySelector(".modal__content > iframe")
        .setAttribute("src", videoSrc);
    } else {
      modal
        .querySelector(".modal__content")
        .insertAdjacentHTML("afterbegin", "<p>No trailer</p>");
    }

    modal.classList.toggle("active");
  };

  return (
    <div
      className={`hero-slide__item ${props.className}`}
      style={{ backgroundImage: `url(${item.backdropUrl})` }}
    >
      <div className="hero-slide__item__content container">
        <div className="hero-slide__item__content__info">
          <h2 className="title">{item.title}</h2>
          <div className="overview">{item.overview}</div>
          <div className="btns">
            <Button onClick={() => navigate(`/movie/${item._id}/detail`)}>
              Watch now
            </Button>
            <OutlineButton onClick={setModalActive}>
              Watch trailer
            </OutlineButton>
          </div>
        </div>
        <div className="hero-slide__item__content__poster">
          <img src={item.posterUrl?.replace("w185", "w500")} alt="" />
        </div>
      </div>
    </div>
  );
};

// const TrailerModal = (props) => {
//   const item = props.item;
//   const iframeRef = useRef(null);

//   const onClose = () => iframeRef.current.setAttribute("src", "");

//   return (
//     <Modal active={false} id={`modal_${item._id}`}>
//       <ModalContent onClose={onClose}>
//         <iframe
//           ref={iframeRef}
//           width="100%"
//           height="500px"
//           title="trailer"
//         ></iframe>
//       </ModalContent>
//     </Modal>
//   );
// };

export default HeroSlide;
