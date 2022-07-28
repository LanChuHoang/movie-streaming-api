const movieModel = require("../../models/movie/movie.model");
const Movie = require("../../models/movie/Movie");
const app = require("../../app");
const agent = require("supertest").agent(app);
const testHelper = require("../../helpers/test.helper");
const {
  errorResponse,
  DEFAULT_PAGE_SIZE,
} = require("../../configs/route.config");

beforeAll(testHelper.connectDB);
afterAll(testHelper.disconnectDB);
afterEach(testHelper.clearDB);
// beforeEach(() => {
//   console.log(expect.getState().currentTestName);
// });

describe("POST /movie - create movie", () => {
  const url = "/api/movie";

  test("case: Success", async () => {
    const validMovie = { title: "create movie success" };
    await agent
      .post(url)
      .send(validMovie)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((res) => expect(res.body.title).toEqual(validMovie.title));
  });

  test("case: Movie is already existed", async () => {
    const mockMovie = await movieModel.addMovie({ title: "existed" });
    const invalidMovie = { title: mockMovie.title };
    await agent
      .post(url)
      .send(invalidMovie)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => expect(res.body).toEqual(errorResponse.MOVIE_EXISTED));
  });

  describe("case: Invalid fields", () => {
    const testCases = [
      {
        name: "case: Missing title field",
        invalidObject: {},
        expected: errorResponse.MISSING_TITLE,
      },
      {
        name: "case: Invalid genres field",
        invalidObject: { title: "invalid genres", genres: ["A"] },
        expected: errorResponse.INVALID_GENRES,
      },
      {
        name: "case: Invalid countries field",
        invalidObject: { title: "invalid countries", countries: ["A"] },
        expected: errorResponse.INVALID_COUNTRIES,
      },
      {
        name: "case: Invalid runtime field",
        invalidObject: { title: "invalid runtime", runtime: "a" },
        expected: errorResponse.INVALID_QUERY,
      },
      {
        name: "case: Invalid releaseDate field",
        invalidObject: { title: "invalid releaseDate", releaseDate: "a" },
        expected: errorResponse.INVALID_QUERY,
      },
    ];

    for (const testCase of testCases) {
      test(testCase.name, async () => {
        await agent
          .post(url)
          .send(testCase.invalidObject)
          .expect("Content-Type", /json/)
          .expect(400)
          .expect((res) => expect(res.body).toEqual(testCase.expected));
      });
    }
  });
});

describe("GET Movies", () => {
  describe("GET /movie?genre&country&year&sort&page", () => {
    const endpoint = "/api/movie";

    test("case: Success", async () => {
      const movies = [
        {
          title: "get movies 1",
          genres: ["Action"],
          countries: ["VN"],
          releaseDate: "2022-01-02",
        },
        {
          title: "get movies 2",
          genres: ["Action"],
          countries: ["VN"],
          releaseDate: "2022-01-01",
        },
        {
          title: "get movies 3",
          genres: ["Adventure"],
          countries: ["US"],
          releaseDate: "2023-01-03",
        },
      ];
      const [movie1, movie2, movie3] = await Movie.insertMany(movies);

      const url = `${endpoint}?genre=Action&country=VN&year=2022&sort=releaseDate&page=1`;
      const response = await agent
        .get(url)
        .expect("Content-Type", /json/)
        .expect(200);
      const { docs, ...paginationInfo } = response.body;
      console.log(docs);

      const expectedPaginationInfo = {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total_pages: 1,
        total_documents: 2,
      };
      expect(paginationInfo).toEqual(expectedPaginationInfo);
      const expectedDocs = [movie1.title, movie2.title];
      expect(docs.map((d) => d.title)).toEqual(expectedDocs);
    });

    testHelper.testInvalidFilterParams(endpoint);
  });

  describe("GET /movie/search?query&page - search movies", () => {
    const endpoint = "/api/movie/search";

    test("case: Success", async () => {
      await Movie.insertMany([
        { title: "a b" },
        { title: "b d" },
        { title: "ab" },
      ]);
      const query = "a b";
      const response = await agent
        .get(`${endpoint}?query=${query}`)
        .expect("Content-Type", /json/)
        .expect(200);

      const receivedTitles = response?.body.docs.map((d) => d.title);
      const expectedTitles = ["a b", "b d"];
      expect(receivedTitles).toEqual(expectedTitles);
      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(response.body.total_pages).toBe(1);
      expect(response.body.total_documents).toBe(expectedTitles.length);
    });

    testHelper.testInvalidQueryParam(endpoint);
    testHelper.testInvalidPageParam(endpoint);
  });

  describe("GET /movie/upcoming?page - get upcoming movies", () => {
    const endpoint = "/api/movie/upcoming";

    test("case: Success", async () => {
      await movieModel.addMovie({ title: "old movie" });
      const upcomingMovie = await movieModel.addMovie({
        title: "upcoming",
        isUpcoming: true,
      });

      const response = await agent
        .get(endpoint)
        .expect("Content-Type", /json/)
        .expect(200);

      const expected = {
        docs: [
          {
            _id: upcomingMovie._id.toString(),
            title: upcomingMovie.title,
            genres: upcomingMovie.genres,
            trailers: upcomingMovie.trailers,
          },
        ],
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total_pages: 1,
        total_documents: 1,
      };

      expect(response.body).toEqual(expected);
    });

    testHelper.testInvalidPageParam(endpoint);
  });

  describe("GET /movie/:id/similar - get similar movies", () => {
    test("case: Success", async () => {
      const [a, b, c, d] = ["Action", "Adventure", "Animation", "Comedy"];
      const [m1, m2, m3] = await Movie.insertMany([
        { title: "ABC", genres: [a, b, c] },
        { title: "AB", genres: [a, b] },
        { title: "A", genres: [a] },
        { title: "D", genres: [d] },
      ]);
      const mockMovie = await movieModel.addMovie({
        title: "similar",
        genres: [a, b, c],
      });

      const response = await agent
        .get(`/api/movie/${mockMovie._id}/similar`)
        .expect("Content-Type", /json/)
        .expect(200);

      const expected = [m1.title, m2.title, m3.title];
      expect(response.body.map((m) => m.title)).toEqual(expected);
    });

    testHelper.testNotFoundIDCase("/api/movie", "/similar");
  });
});

describe("GET Single Movie", () => {
  describe("GET /movie/random - get random movie", () => {
    test("case: Success", async () => {
      const mockMovie = await movieModel.addMovie({
        title: "random movie",
      });
      const response = await agent
        .get("/api/movie/random")
        .expect("Content-Type", /json/)
        .expect(200);
      const expected = mockMovie.toObject();
      expected._id = expected._id.toString();
      expect(expected).toMatchObject(response.body[0]);
    });
  });

  describe("GET /movie/:id/ - get movie detail", () => {
    const endpoint = "/api/movie";

    test("case: Success", async () => {
      const mockMovie = await movieModel.addMovie({
        title: "get movie detail",
      });
      const response = await agent
        .get(`${endpoint}/${mockMovie._id}`)
        .expect("Content-Type", /json/)
        .expect(200);
      const expected = mockMovie.toObject();
      expected._id = expected._id.toString();
      expect(expected).toMatchObject(response.body);
    });

    testHelper.testInvalidIDParam(endpoint);
    testHelper.testNotFoundIDCase(endpoint);
  });
});

describe("PATCH /movie/:id - update movie", () => {
  const endpoint = "/api/movie";

  test("case: Success", async () => {
    const mockMovie = await movieModel.addMovie({ title: "to patch movie" });
    const validUpdate = { title: "patched movie" };
    await agent
      .patch(`${endpoint}/${mockMovie._id}`)
      .send(validUpdate)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => expect(res.body.title).toEqual(validUpdate.title));
  });

  test("case: Movie is already existed", async () => {
    const mockMovie = await movieModel.addMovie({ title: "existed patch" });
    const toPatchMovie = await movieModel.addMovie({
      title: "to patch movie 2",
    });
    const invalidUpdate = { title: mockMovie.title };
    await agent
      .patch(`${endpoint}/${toPatchMovie._id}`)
      .send(invalidUpdate)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => expect(res.body).toEqual(errorResponse.MOVIE_EXISTED));
  });

  describe("case: Invalid fields", () => {
    const testCases = [
      {
        name: "case: Invalid genres field",
        invalidObject: { title: "invalid genres", genres: ["A"] },
        expected: errorResponse.INVALID_GENRES,
      },
      {
        name: "case: Invalid countries field",
        invalidObject: { title: "invalid countries", countries: ["A"] },
        expected: errorResponse.INVALID_COUNTRIES,
      },
      {
        name: "case: Invalid runtime field",
        invalidObject: { title: "invalid runtime", runtime: "a" },
        expected: errorResponse.INVALID_QUERY,
      },
      {
        name: "case: Invalid releaseDate field",
        invalidObject: { title: "invalid releaseDate", releaseDate: "a" },
        expected: errorResponse.INVALID_QUERY,
      },
    ];

    for (const testCase of testCases) {
      test(testCase.name, async () => {
        const mockMovie = await movieModel.addMovie({
          title: "to patch invalid fields",
        });
        await agent
          .patch(`${endpoint}/${mockMovie._id}`)
          .send(testCase.invalidObject)
          .expect("Content-Type", /json/)
          .expect(400)
          .expect((res) => expect(res.body).toEqual(testCase.expected));
      });
    }
  });

  testHelper.testInvalidIDParam(endpoint);
  testHelper.testNotFoundIDCase(endpoint);
});

describe("DELETE /movie/:id/ - delete movie", () => {
  const endpoint = "/api/movie";

  test("case: Success", async () => {
    const mockMovie = await movieModel.addMovie({ title: "delete movie" });
    const response = await agent
      .delete(`${endpoint}/${mockMovie._id}`)
      .expect("Content-Type", /json/)
      .expect(200);
    const expected = mockMovie.toObject();
    expected._id = expected._id.toString();
    expect(expected).toMatchObject(response.body);
  });

  testHelper.testInvalidIDParam(endpoint);
  testHelper.testNotFoundIDCase(endpoint);
});
