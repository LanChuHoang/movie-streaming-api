import { Link } from "react-router-dom";
import { OutlineButton } from "../components/button/Button";
import HeroSlide from "../components/hero-slide/HeroSlide";
import MovieList from "../components/movie-list/MovieList";
import MediaApi from "../api/backendApi/MediaApi";

const Home = () => {
  return (
    <>
      <HeroSlide />
      <div className="container">
        {sections.map((s) => (
          <HomeSection key={s.title} {...s} />
        ))}
      </div>
    </>
  );
};

const sections = [
  {
    title: "Popular Movies",
    itemType: MediaApi.itemType.movie,
    listType: MediaApi.listType.popular,
  },
  {
    title: "Lastest Movies",
    itemType: MediaApi.itemType.movie,
    listType: MediaApi.listType.lastest,
  },
  {
    title: "Coming Soon",
    itemType: MediaApi.itemType.movie,
    listType: MediaApi.listType.upcoming,
  },
  {
    title: "Popular Shows",
    itemType: MediaApi.itemType.show,
    listType: MediaApi.listType.popular,
  },
  {
    title: "Lastest Shows",
    itemType: MediaApi.itemType.show,
    listType: MediaApi.listType.lastest,
  },
];

const HomeSection = ({
  title,
  viewMorePath = "/movie/browse",
  itemType,
  listType,
}) => {
  return (
    <div className="section mb-3">
      <div className="section__header mb-2">
        <h2>{title}</h2>
        <Link to={viewMorePath}>
          <OutlineButton className="small">View more</OutlineButton>
        </Link>
      </div>
      <MovieList itemType={itemType} listType={listType} />
    </div>
  );
};

export default Home;
