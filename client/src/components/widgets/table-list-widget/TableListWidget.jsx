import BasicTable from "../../tables/basic-table/BasicTable";
import "./tableListWidget.scss";

const TableListWidget = (props) => {
  return (
    <div className="newest-users-list widget">
      <h3>{props.title}</h3>
      <BasicTable columns={props.columns} rows={props.rows} />
    </div>
  );
};

export default TableListWidget;
