import { Select, MenuItem } from "@mui/material";
import BasicAreaChart from "../../../components/charts/basic-area-chart/BasicAreaChart";
import "./chartWidget.scss";

const ChartWidget = ({ value, onChange, chartOptions, chartData }) => {
  return (
    <div className="user-area-chart widget">
      <Select
        className="chart-select"
        value={value}
        onChange={onChange}
        MenuProps={{
          classes: {
            root: "admin-menu",
          },
        }}
      >
        {chartOptions.map((o, i) => (
          <MenuItem key={i} value={i}>
            {o.display}
          </MenuItem>
        ))}
      </Select>
      <BasicAreaChart
        data={chartData.data}
        xDataKey={chartData.xKey}
        yDataKey={chartData.yKey}
      />
    </div>
  );
};

export default ChartWidget;
