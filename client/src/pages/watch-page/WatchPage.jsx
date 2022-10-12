import "./watchPage.scss";
import { useEffect, useState } from "react";
import VideoJs from "../../components/video-js-player/VideoJs";
import { useParams } from "react-router-dom";
import useBackendApi from "../../hooks/useBackendApi";
import MediaApi from "../../api/backendApi/class/MediaApi";

const WatchPage = ({ itemType }) => {
  const { id, seasonNumber, episodeNumber } = useParams();
  const [videoUrl, setVideoUrl] = useState();
  const backendApi = useBackendApi()[itemType];

  useEffect(() => {
    document.querySelector(".header").classList.add("forced-shrink");
    return () => {
      document.querySelector(".header").classList.remove("forced-shrink");
    };
  }, []);

  useEffect(() => {
    const getVideoUrl = async () => {
      try {
        const url =
          itemType === MediaApi.itemType.movie
            ? await backendApi.getVideoUrl(id)
            : await backendApi.getVideoUrl(
                id,
                Number(seasonNumber),
                Number(episodeNumber)
              );
        setVideoUrl("http://localhost:8000/the_witcher/The_Witcher_S01E07.mpd");
      } catch (error) {
        console.log(error);
      }
    };
    id && getVideoUrl();
  }, [itemType, id, seasonNumber, episodeNumber, backendApi]);

  return (
    <div className="watch-page-container">
      {videoUrl && <VideoJs src={videoUrl} />}
    </div>
  );
};

export default WatchPage;
