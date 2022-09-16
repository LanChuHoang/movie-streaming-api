import { Lazy, Mousewheel, FreeMode } from "swiper";
import { Swiper } from "swiper/react";

const LazySwiper = (props) => {
  return (
    <Swiper
      grabCursor={true}
      spaceBetween={10}
      lazy={true}
      mousewheel={{ forceToAxis: true }}
      freeMode={true}
      modules={[Lazy, Mousewheel, FreeMode]}
      {...props}
    />
  );
};

export default LazySwiper;
