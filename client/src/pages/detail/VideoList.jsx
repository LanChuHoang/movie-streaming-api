import { useCallback, useState } from "react";
import { SwiperSlide } from "swiper/react";
import PlayButton from "../../components/buttons/play-button/PlayButton";
import LazySwiper from "../../components/lazy-swiper/LazySwiper";
import TrailerModal from "../../components/modals/trailer-modal/TrailerModal";
import Overlay from "../../components/overlay/Overlay";
import "./videoList.scss";

const VideoList = ({ videos = [] }) => {
  const [toPlayUrl, setToPlayUrl] = useState();

  const handleVideoItemClick = useCallback((url) => {
    setToPlayUrl(url);
  }, []);

  const handleTrailerClose = useCallback(() => {
    setToPlayUrl();
  }, []);

  return (
    <div className="video-list-container">
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
      >
        {videos.map((v) => (
          <SwiperSlide key={v.srcUrl}>
            <VideoItem {...v} onClick={handleVideoItemClick} />
          </SwiperSlide>
        ))}
      </LazySwiper>
      <TrailerModal
        open={toPlayUrl !== undefined}
        onClose={handleTrailerClose}
        srcUrl={toPlayUrl}
      />
    </div>
  );
};

const VideoItem = ({ thumbnailUrl, title = "Trailer", srcUrl, onClick }) => {
  return (
    <div className="video-item-container" onClick={() => onClick(srcUrl)}>
      <div className="thumbnail-container">
        <img loading="lazy" src={thumbnailUrl} alt={srcUrl} />
        <PlayButton />
      </div>
      <div className="video-title">{title}</div>
      <Overlay />
    </div>
  );
};

export default VideoList;
