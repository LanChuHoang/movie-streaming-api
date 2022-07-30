import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Chart from "../../../components/chart/Chart";
import BasicAreaChart from "../../../components/charts/basic-area-chart/BasicAreaChart";
import Table from "../../../components/table/Table";
import BasicTable from "../../../components/tables/basic-table/BasicTable";
import { Select, MenuItem } from "@mui/material";
import "./dashboard.scss";
import { useState, useEffect } from "react";

function createData(id, username, email, joinDate, isAdmin) {
  const role = isAdmin ? (
    <div className="admin-role-cell">Admin</div>
  ) : (
    <div className="user-role-cell">User</div>
  );
  return { id, username, email, joinDate, role };
}

const rows = [
  createData(1, "chulan1", "chulan1@gmail.com", "1-1-2001", true),
  createData(2, "chulan2", "chulan2@gmail.com", "2-2-2002", false),
  createData(3, "chulan3", "chulan3@gmail.com", "3-3-2003", true),
  createData(4, "chulan4", "chulan4@gmail.com", "4-4-2004", false),
  createData(5, "chulan5", "chulan5@gmail.com", "5-5-2005", true),
];

const chartOptions = [
  {
    display: "Last Week (Total users)",
  },
  {
    display: "Last Month (Total users)",
  },
  {
    display: "Last 6 Months (Total users)",
  },
];

function createChartData() {
  return [0, 1, 2, 3, 4].map((i) => {
    return {
      total: Math.round(Math.random() * 3000),
      date: `Day ${i + 1}`,
    };
  });
}

const mockItems = [
  { label: "Total Users", amount: 462370 },
  { label: "Today", increased: false, amount: 789 },
  { label: "This week", increased: true, amount: 1946 },
  { label: "This month", increased: true, amount: 97439 },
];

const Dashboard = () => {
  const [summaryItems, setSummaryItems] = useState([]);
  const [selectedChartIndex, setSelectedChartIndex] = useState(
    chartOptions.length - 1
  );
  const [chartData, setChartData] = useState({});
  const [newestAccount, setNewestAccount] = useState([]);

  // Load data for Summary Widget
  const loadSummary = async () => {
    const items = mockItems;
    items[0].amount += Math.round(Math.random() * 30);
    setSummaryItems([...items]);
  };

  useEffect(() => loadSummary(), []);

  // Load data for Chart Widget
  const loadChartData = async () => {
    const data = {
      data: createChartData(),
      xKey: "date",
      yKey: "total",
    };
    console.log(data);
    setChartData(data);
  };

  useEffect(() => loadChartData(), []);

  const handleChartOptionChange = (e) => {
    const index = e.target.value;
    loadChartData();
    setSelectedChartIndex(index);
  };

  // Load data for Table List Widget
  useEffect(() => {
    const loadNewestAccounts = async () => {
      const accounts = rows;
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
        <UserChartWidget
          value={selectedChartIndex}
          chartOptions={chartOptions}
          chartData={chartData}
          onChange={handleChartOptionChange}
        />
      </div>
      <TableListWidget
        title="Newest Accounts"
        columns={Object.keys(newestAccount[0] || {})}
        rows={newestAccount}
      />
    </div>
  );
};

const AmountItem = (props) => {
  return (
    <div
      className={
        "summary-item " +
        (props.increased ? "increased-amount" : "decreased-amount")
      }
    >
      <FontAwesomeIcon icon={props.increased ? faChevronUp : faChevronDown} />
      {props.amount}
    </div>
  );
};

const SummaryWidget = (props) => {
  return (
    <div className="summary-widget-container widget">
      <div className="header-container">
        <h3>{props.summaryItems[props.mainItemIndex]?.label}</h3>
        <FontAwesomeIcon
          icon={faArrowRotateRight}
          onClick={() => props.onReset()}
        />
      </div>
      <div className="content-container">
        <p className="total-users-amount">
          {props.summaryItems[props.mainItemIndex]?.amount}
        </p>
        <p>Processing users may not be included. Reload to update the stats.</p>
        <div className="summary-items-container">
          {props.summaryItems.map((item, i) => {
            return i !== props.mainItemIndex ? (
              <>
                <div className="summary-item title-item">{item.label}</div>
                <AmountItem increased={item.increased} amount={item.amount} />
              </>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

const UserChartWidget = (props) => {
  return (
    <div className="user-area-chart widget">
      <Select
        className="chart-select"
        value={props.value}
        onChange={props.onChange}
      >
        {props.chartOptions.map((o, i) => (
          <MenuItem key={i} value={i}>
            {o.display}
          </MenuItem>
        ))}
      </Select>
      <BasicAreaChart
        data={props.chartData.data}
        xDataKey={props.chartData.xKey}
        yDataKey={props.chartData.yKey}
      />
    </div>
  );
};

const TableListWidget = (props) => {
  return (
    <div className="newest-users-list widget">
      <h3>{props.title}</h3>
      <BasicTable columns={props.columns} rows={props.rows} />
    </div>
  );
};

export default Dashboard;
