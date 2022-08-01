import { Select, MenuItem } from "@mui/material";
import BasicAreaChart from "../../../components/charts/basic-area-chart/BasicAreaChart";
import "./chartWidget.scss";

const ChartWidget = (props) => {
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

export default ChartWidget;
