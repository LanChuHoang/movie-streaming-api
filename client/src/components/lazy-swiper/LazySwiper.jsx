import { Lazy, Mousewheel } from "swiper";
import { Swiper } from "swiper/react";

const LazySwiper = (props) => {
  return (
    <Swiper
      grabCursor={true}
      spaceBetween={10}
      lazy={true}
      mousewheel={{ forceToAxis: true }}
      cssMode={true}
      modules={[Lazy, Mousewheel]}
      {...props}
    />
  );
};

export default LazySwiper;
