import { Lazy, Mousewheel } from "swiper";
import { Swiper } from "swiper/react";

const LazySwiper = (props) => {
  return (
    <Swiper
      grabCursor={true}
      spaceBetween={15}
      lazy={true}
      mousewheel={{ forceToAxis: true }}
      cssMode={true}
      modules={[Lazy, Mousewheel]}
      {...props}
    />
  );
};

export default LazySwiper;
