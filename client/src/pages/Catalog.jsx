import PageHeader from "../components/page-header/PageHeader";
import { itemType as type } from "../api/backendApi";
import MovieGrid from "../components/movie-grid/MovieGrid";

const Catalog = ({ itemType, browseType }) => {
  return (
    <>
      <PageHeader>{itemType === type.movie ? "Movies" : "Shows"}</PageHeader>
      <div className="container">
        <div className="section mb-3">
          <MovieGrid itemType={itemType} browseType={browseType} />
        </div>
      </div>
    </>
  );
};

export default Catalog;
