export const apiOptions = {
  MOVIE_GENRES: [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ],
  SHOW_GENRES: [
    "Action & Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Kids",
    "Mystery",
    "News",
    "Reality",
    "Sci-Fi & Fantasy",
    "Soap",
    "Talk",
    "War & Politics",
    "Western",
  ],
  COUNTRIES: [
    "US",
    "KR",
    "GB",
    "FR",
    "CA",
    "HK",
    "JP",
    "CN",
    "TW",
    "IN",
    "TH",
    "AU",
    "VN",
    "DE",
    "SE",
    "IT",
    "HU",
    "IE",
    "MT",
    "NZ",
    "RU",
    "IS",
    "FI",
    "MW",
    "CO",
    "DK",
    "BE",
    "ES",
    "AR",
    "NL",
    "NO",
    "SG",
    "PL",
    "MY",
    "ID",
    "IR",
    "PR",
    "NP",
    "BG",
    "KH",
    "PH",
    "TR",
    "MA",
    "BR",
    "MX",
    "CZ",
    "RO",
    "PS",
    "KZ",
    "ZA",
  ],
};

export const GENDERS = ["male", "female"];
export const JOBS = ["Actor", "Director"];

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const getOptions = (options, sort = "asc") => {
  const compare =
    sort === "asc"
      ? (a, b) => a.display - b.display
      : (a, b) => b.display - a.display;
  return options.map((o) => ({ display: o, value: o })).sort(compare);
};

const getYears = (startYear, endYear) => {
  return Array.from(Array(endYear - startYear + 1), (_, x) => x + startYear);
};

const anyOption = { display: "Any", value: "" };

const filterOptions = {
  movieGenres: [anyOption, ...getOptions(apiOptions.MOVIE_GENRES)],
  showGenres: [anyOption, ...getOptions(apiOptions.SHOW_GENRES)],
  countries: [anyOption].concat(
    apiOptions.COUNTRIES.map((g) => {
      return { display: regionNames.of(g), value: g };
    }).sort((a, b) => a.display - b.display)
  ),
  years: [anyOption, ...getOptions(getYears(2000, 2022), "desc")],
  sorts: [{ display: "Release Date", value: "" }],
};

export default filterOptions;
