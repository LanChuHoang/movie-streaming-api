import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "comment" })
export class Review {
  @PrimaryColumn()
  id: string;

  @Column({ name: "video_id" })
  videoId: string;

  @Column({ name: "media_id" })
  mediaId: string;

  @Column({ name: "content" })
  content: string;

  @Column({ name: "author_name" })
  authorName: string;

  @Column({ name: "author_profile_image_url" })
  authorProfileImageUrl: string;

  @Column({ name: "like_count" })
  likeCount: number;

  @Column({ name: "published_at" })
  publishedAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "media_type" })
  mediaType: string;

  @Column({ name: "sentiment" })
  sentiment: string;
}
