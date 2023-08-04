import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/users/schemas/user.schema";

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  findAll() {
    return `This action returns all statistic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }

  getTotalUsers() {
    return this.model.estimatedDocumentCount();
  }

  countUsers(startDate?: Date, endDate?: Date) {
    const filter: any = {};
    if (startDate && endDate)
      filter.createdAt = { $gte: startDate, $lte: endDate };
    return this.model.find(filter).count();
  }

  countUsersDaily(startDate: Date, endDate: Date) {
    return this.model.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalUsers: { $sum: 1 },
        },
      },
      { $project: { _id: 0, date: "$_id", totalUsers: 1 } },
      { $sort: { date: 1 } },
    ]);
  }

  countUsersMonthly(startDate: Date, endDate: Date) {
    return this.model.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalUsers: { $sum: 1 },
        },
      },
      { $project: { _id: 0, month: "$_id", totalUsers: 1 } },
      { $sort: { month: 1 } },
    ]);
  }
}
