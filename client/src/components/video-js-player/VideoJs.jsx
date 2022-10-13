import { useRef, useEffect } from "react";
import videojs from "video.js";
import "./videoJs.scss";
import "video.js/dist/video-js.css";
import "videojs-http-source-selector";
import "videojs-contrib-quality-levels";
import "videojs-sprite-thumbnails";
import "videojs-hotkeys";

const VideoJs = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const playerOptions = {
        ...DEFAULT_OPTIONS,
        sources: [{ src, type: "application/dash+xml" }],
      };
      const player = (playerRef.current = videojs(
        videoElement,
        playerOptions,
        () => {
          videojs.log("player is ready");
        }
      ));
      player.httpSourceSelector();
      player.spriteThumbnails();
      setupUI();
    } else {
      const player = playerRef.current;
      player.src([{ src, type: "application/dash+xml" }]);
    }
  }, [src, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered custom-video-js-skin"
      />
    </div>
  );
};

const DEFAULT_OPTIONS = {
  autoplay: false,
  controls: true,
  responsive: true,
  preload: "auto",
  tracks: [
    {
      src: "https://dz9lsde6so2tm.cloudfront.net/dash/the_witcher/sub_vi.vtt",
      kind: "subtitles",
      srclang: "vi",
      label: "Vietnamese",
      default: true,
    },
    {
      src: "https://dz9lsde6so2tm.cloudfront.net/dash/the_witcher/sub_en.vtt",
      kind: "subtitles",
      srclang: "en",
      label: "English",
    },
  ],

  plugins: {
    httpSourceSelector: {
      default: "auto",
    },
    hotkeys: {
      alwaysCaptureHotkeys: true,
      enableVolumeScroll: false,
      enableModifiersForNumbers: false,
      captureDocumentHotkeys: true,
      documentHotkeysFocusElementFilter: (e) =>
        e.tagName.toLowerCase() === "body",
    },
    spriteThumbnails: {
      interval: 60,
      url: "https://dz9lsde6so2tm.cloudfront.net/dash/the_witcher/the_witcher_s01e07_sprite.png",
      width: 100 * 1.5,
      height: 56 * 1.5,
      responsive: 0,
    },
  },
  html5: {
    dash: {
      useTTML: true,
    },
  },
};

function setupUI() {
  const buttons = document.querySelectorAll("button.vjs-button");
  buttons.forEach((b) =>
    b.addEventListener("click", function () {
      this.blur();
    })
  );
}

export default VideoJs;
