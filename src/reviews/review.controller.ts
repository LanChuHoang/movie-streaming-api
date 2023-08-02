import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenAuthGuard } from "src/auth/guards/access-token-auth.guard";
import { ReviewService } from "src/reviews/review.service";

@UseGuards(AccessTokenAuthGuard)
@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get("top")
  async getTopReviews(
    @Query("mediaId") mediaId: string,
    @Query("limit", new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    limit = Math.min(limit, 100);
    const reviews = await this.reviewService.getTopReviews(mediaId, limit);
    if (!reviews || reviews.length == 0) throw new NotFoundException();
    return reviews;
  }

  @Get("sentiment_overview")
  async getSentimentOverview(@Query("mediaId") mediaId: string) {
    const result = await this.reviewService.getSentimentOverview(mediaId);
    if (!result) throw new NotFoundException();
    return result;
  }
}
