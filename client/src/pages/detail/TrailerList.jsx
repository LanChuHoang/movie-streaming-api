import { useEffect, useRef } from "react";
import { toYoutubeVideoUrl } from "../../api/helper";

const TrailerList = ({ videos = [] }) => {
  return (
    <>
      {videos.map((v) => (
        <TrailerItem key={v} path={v} />
      ))}
    </>
  );
};

const TrailerItem = ({ path }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const height = (iframeRef.current.offsetWidth * 9) / 16 + "px";
    iframeRef.current.setAttribute("height", height);
  }, []);

  return (
    <div className="video">
      <div className="video__title">
        <h2>{"Trailer"}</h2>
      </div>
      <iframe
        src={toYoutubeVideoUrl(path)}
        ref={iframeRef}
        width="100%"
        title="video"
      ></iframe>
    </div>
  );
};

export default TrailerList;
