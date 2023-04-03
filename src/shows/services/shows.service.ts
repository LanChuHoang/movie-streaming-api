import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MediaService } from "src/media/services/media.service";
import { Show, ShowDocument } from "../schemas/show.schema";

@Injectable()
export class ShowsService extends MediaService<ShowDocument> {
  constructor(@InjectModel(Show.name) movieModel: Model<ShowDocument>) {
    super(movieModel);
  }
}
