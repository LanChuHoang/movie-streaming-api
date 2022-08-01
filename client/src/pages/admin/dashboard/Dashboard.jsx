import { useState, useEffect } from "react";
import useBackendApi from "../../../hooks/useBackendApi";
import { statType } from "../../../api/backendApi";
import {
  TIMES_IN_DAY,
  getStartOfDay,
  getMonthEnd,
  getMonthStart,
  toShortDateFormat,
  toFullDateFormat,
} from "../../../api/helper";

import SummaryWidget from "../../../components/widgets/summary-widget/SummaryWidget";
import ChartWidget from "../../../components/widgets/chart-widget/ChartWidget";
import TableListWidget from "../../../components/widgets/table-list-widget/TableListWidget";
import "./dashboard.scss";

const today = getStartOfDay();

const chartOptions = [
  {
    display: "Last 7 days (Total users)",
    startDate: new Date(today.getTime() - 7 * TIMES_IN_DAY),
    endDate: new Date(today.getTime() + TIMES_IN_DAY),
    type: statType.daily,
  },
  {
    display: "Last 30 days (Total users)",
    startDate: new Date(today.getTime() - 30 * TIMES_IN_DAY),
    endDate: new Date(today.getTime() + TIMES_IN_DAY),
    type: statType.daily,
  },
  {
    display: "Last 6 months (Total users)",
    startDate: getMonthStart(
      (today.getMonth() - 5) % 12,
      today.getMonth() - 5 >= 0 ? today.getFullYear() : today.getFullYear() - 1
    ),
    endDate: getMonthEnd(),
    type: statType.monthly,
  },
];

const Dashboard = () => {
  const [summaryItems, setSummaryItems] = useState([]);
  const [selectedChartIndex, setSelectedChartIndex] = useState(1);
  const [chartData, setChartData] = useState({});
  const [newestAccount, setNewestAccount] = useState([]);
  const backendApi = useBackendApi();

  // Load data for Summary Widget
  const loadSummary = async () => {
    const response = (await backendApi.getUserOverallStats()).data;
    const items = [
      { label: "Total Users", amount: response.total },
      {
        label: "Today",
        increased: response.today.increased,
        amount: response.today.count,
      },
      {
        label: "This week",
        increased: response.thisWeek.increased,
        amount: response.thisWeek.count,
      },
      {
        label: "This month",
        increased: response.thisMonth.increased,
        amount: response.thisMonth.count,
      },
    ];
    setSummaryItems(items);
  };

  useEffect(() => loadSummary(), []);

  // Load data for Chart Widget
  useEffect(() => {
    const loadChartData = async (startDate, endDate, type) => {
      const response = (
        await backendApi.getUserDetailStats(startDate, endDate, type)
      ).data;
      const chartData = response.map((r) => {
        return {
          date:
            type === statType.daily
              ? toShortDateFormat(r.date)
              : toShortDateFormat(r.month),
          Total: r.totalUsers,
        };
      });
      setChartData({ data: chartData, xKey: "date", yKey: "Total" });
    };
    const { startDate, endDate, type } = chartOptions[selectedChartIndex];
    loadChartData(startDate, endDate, type);
  }, [selectedChartIndex]);

  // Load data for Table List Widget
  useEffect(() => {
    const loadNewestAccounts = async () => {
      const createData = (id, username, email, joinDate, isAdmin) => {
        const formattedDate = toFullDateFormat(joinDate);
        const role = isAdmin ? (
          <div className="admin-role-cell">Admin</div>
        ) : (
          <div className="user-role-cell">User</div>
        );
        return { id, username, email, joinDate: formattedDate, role };
      };

      const response = (
        await backendApi.getUsers({ limit: 5, sort_by: "createdAt:desc" })
      ).data;
      const accounts = response.docs.map((a) =>
        createData(a._id, a.username, a.email, a.createdAt, a.isAdmin)
      );

      setNewestAccount(accounts);
    };
    loadNewestAccounts();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="summary-section">
        <SummaryWidget
          summaryItems={summaryItems}
          mainItemIndex={0}
          onReset={loadSummary}
        />
        <ChartWidget
          value={selectedChartIndex}
          chartOptions={chartOptions}
          chartData={chartData}
          onChange={(e) => setSelectedChartIndex(e.target.value)}
        />
      </div>
      <TableListWidget
        title="Newest Accounts"
        columns={["ID", "Username", "Email", "Join date", "Role"]}
        rows={newestAccount}
      />
    </div>
  );
};

export default Dashboard;
