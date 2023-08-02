import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./review.entity";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  getTopReviews(mediaId: string, limit = 5) {
    return this.reviewsRepository
      .createQueryBuilder()
      .select()
      .where("media_id = :mediaId", { mediaId })
      .orderBy("like_count", "DESC")
      .limit(limit)
      .getMany();
  }

  async getSentimentOverview(mediaId: string) {
    const rows = await this.reviewsRepository
      .createQueryBuilder()
      .select("sentiment")
      .addSelect("Count(*) as reviewCount")
      .where("media_id = :mediaId", { mediaId })
      .groupBy("sentiment")
      .execute();
    if (!rows || rows.length == 0) return;
    const result: any = {};
    rows.forEach(
      ({
        sentiment,
        reviewCount,
      }: {
        sentiment: string;
        reviewCount: string;
      }) => {
        const field = `${sentiment}Count`;
        result[field] = +reviewCount;
      },
    );
    result.totalReviews = result.positiveCount + result.negativeCount;
    result.positivePercentage =
      Math.round((result.positiveCount / result.totalReviews) * 100) / 100;
    result.negativePercentage = 100 - result.positivePercentage;
    return result;
  }
}
