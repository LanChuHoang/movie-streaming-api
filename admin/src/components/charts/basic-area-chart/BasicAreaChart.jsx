import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./basicAreaChart.scss";

const BasicAreaChart = (props) => {
  return (
    <div className="basic-area-chart-container">
      <ResponsiveContainer aspect={1.8}>
        <AreaChart data={props.data}>
          <defs>
            <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey={props.xDataKey} stroke="gray" />
          <CartesianGrid
            strokeDasharray="3 3"
            className="basic-area-chart-grid"
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={props.yDataKey}
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#areaColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BasicAreaChart;
