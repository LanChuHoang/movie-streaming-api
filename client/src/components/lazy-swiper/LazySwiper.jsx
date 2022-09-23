import { Mousewheel } from "swiper";
import { Swiper } from "swiper/react";

const LazySwiper = (props) => {
  return (
    <Swiper
      grabCursor={true}
      spaceBetween={15}
      mousewheel={{ forceToAxis: true }}
      cssMode={true}
      modules={[Mousewheel]}
      {...props}
    />
  );
};

export default LazySwiper;
