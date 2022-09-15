import { useState, useEffect, useCallback } from "react";
import useBackendApi from "../../../hooks/useBackendApi";
import { statType } from "../../../api/backendApi";
import {
  TIMES_IN_DAY,
  getStartOfDay,
  getMonthEnd,
  getMonthStart,
  toFullDateFormat,
  fillMissingDailyStats,
  fillMissingMonthlyStats,
} from "../../../api/helper";

import SummaryWidget from "../../../components/widgets/summary-widget/SummaryWidget";
import ChartWidget from "../../../components/widgets/chart-widget/ChartWidget";
import TableListWidget from "../../../components/widgets/table-list-widget/TableListWidget";
import "./dashboard.scss";
import RoleCell from "../../../components/table-cells/role-cell/RoleCell";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [summaryItems, setSummaryItems] = useState([]);
  const [selectedChartIndex, setSelectedChartIndex] = useState(1);
  const [chartData, setChartData] = useState({});
  const [newestAccount, setNewestAccount] = useState([]);
  const backendApi = useBackendApi().user;

  // Load data for Summary Widget
  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [backendApi]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Load data for Chart Widget
  useEffect(() => {
    const loadChartData = async (startDate, endDate, type) => {
      try {
        const response = (
          await backendApi.getUserDetailStats(startDate, endDate, type)
        ).data;
        const chartData =
          type === statType.daily
            ? fillMissingDailyStats(startDate, endDate, response)
            : fillMissingMonthlyStats(startDate, endDate, response);
        setChartData({ data: chartData, xKey: "date", yKey: "Total" });
      } catch (error) {
        console.log(error);
      }
    };
    const { startDate, endDate, type } = chartOptions[selectedChartIndex];
    loadChartData(startDate, endDate, type);
  }, [selectedChartIndex, backendApi]);

  // Load data for Table List Widget
  useEffect(() => {
    const loadNewestAccounts = async () => {
      try {
        const response = (
          await backendApi.getUsers({ limit: 5, sort: "createdAt:desc" })
        ).data;
        const accounts = response.docs.map((a) =>
          createData(a._id, a.username, a.email, a.createdAt, a.isAdmin)
        );
        setNewestAccount(accounts);
      } catch (error) {
        console.log(error);
      }
    };
    loadNewestAccounts();
  }, [backendApi]);

  return (
    <div className="dashboard-container">
      <div className="summary-section">
        <SummaryWidget
          loading={loading}
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
        columns={["ID", "Username", "Email", "Role", "Join date"]}
        rows={newestAccount}
      />
    </div>
  );
};

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
    startDate: new Date(today.getTime() - 29 * TIMES_IN_DAY),
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

const createData = (id, username, email, joinDate, isAdmin) => {
  const formattedDate = toFullDateFormat(joinDate);
  const role = isAdmin ? (
    <RoleCell className="admin-cell align-right-cell">Admin</RoleCell>
  ) : (
    <RoleCell className="user-cell align-right-cell">User</RoleCell>
  );
  return { id, username, email, role, joinDate: formattedDate };
};

export default Dashboard;
