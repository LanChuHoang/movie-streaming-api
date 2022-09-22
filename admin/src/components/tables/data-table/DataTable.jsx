import { DataGrid } from "@mui/x-data-grid";
import "./dataTable.scss";

const DataTable = (props) => {
  return (
    <div className="data-table">
      <DataGrid
        className="data-grid"
        rows={props.rows}
        columns={props.columns}
        getRowId={props.getRowId}
        checkboxSelection={props.checkboxSelection}
        disableSelectionOnClick
        rowsPerPageOptions={props.rowsPerPageOptions || [10]}
        pagination
        paginationMode="server"
        page={props.page || 0}
        pageSize={props.pageSize || 5}
        rowCount={props.totalRows || props.rows?.length || 0}
        onPageChange={props.onPageChange}
        sortingMode="server"
        sortModel={props.sortModel || []}
        onSortModelChange={props.onSortModelChange}
        onSelectionModelChange={props.onSelectionModelChange}
      />
    </div>
  );
};

export default DataTable;
