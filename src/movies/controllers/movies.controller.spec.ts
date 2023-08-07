import { Test, TestingModule } from "@nestjs/testing";
import { MoviesService } from "../services/movies.service";
import { MoviesController } from "./movies.controller";

describe("MoviesController", () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
