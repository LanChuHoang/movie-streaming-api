import { Controller, Get, Query } from "@nestjs/common";
import { GetUserStatisticDetailQueryDto } from "./dto/get-user-statistic-detail-query.dto";
import { TIMES_IN_DAY, getMonday, getStartOfDay, getSunday } from "./helper";
import { StatisticService } from "./statistic.service";

@Controller("statistic")
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get("/user/overall")
  async getOverallUserStatistic() {
    const today = getStartOfDay();
    const tomorrow = new Date(today.getTime() + TIMES_IN_DAY);
    const yesterday = new Date(today.getTime() - TIMES_IN_DAY);
    const dayInLastWeek = new Date(today.getTime() - 7 * TIMES_IN_DAY);

    const thisMonth = today.getMonth();
    const lastMonth = thisMonth - 1 >= 0 ? thisMonth - 1 : 11;
    const thisYear = today.getFullYear();
    const thisMonthStart = new Date(thisYear, thisMonth, 1);
    const thisMonthEnd = new Date(thisYear, thisMonth + 1, 0);
    const lastMonthStart = new Date(thisYear, lastMonth, 1);
    const lastMonthEnd = new Date(thisYear, lastMonth + 1, 0);

    const [
      total,
      totalToday,
      totalYesterday,
      totalThisWeek,
      totalLastWeek,
      totalThisMonth,
      totalLastMonth,
    ] = await Promise.all([
      this.statisticService.countUsers(),
      this.statisticService.countUsers(today, tomorrow),
      this.statisticService.countUsers(yesterday, today),
      this.statisticService.countUsers(getMonday(today), getSunday(today)),
      this.statisticService.countUsers(
        getMonday(dayInLastWeek),
        getSunday(dayInLastWeek),
      ),
      this.statisticService.countUsers(thisMonthStart, thisMonthEnd),
      this.statisticService.countUsers(lastMonthStart, lastMonthEnd),
    ]);

    const response = {
      total,
      today: {
        count: totalToday,
        increased: totalToday >= totalYesterday,
      },
      thisWeek: {
        count: totalThisWeek,
        increased: totalThisWeek >= totalLastWeek,
      },
      thisMonth: {
        count: totalThisMonth,
        increased: totalThisMonth >= totalLastMonth,
      },
    };

    return response;
  }

  @Get("/user/detail")
  async getDetailUserStatistic(@Query() query: GetUserStatisticDetailQueryDto) {
    const startDate = getStartOfDay(query.from);
    const endDate = getStartOfDay(query.to);
    const stats =
      query.type === "daily"
        ? await this.statisticService.countUsersDaily(startDate, endDate)
        : await this.statisticService.countUsersMonthly(startDate, endDate);
    return stats;
  }
}
