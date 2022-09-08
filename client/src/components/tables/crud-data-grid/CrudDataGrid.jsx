import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import "./crudDataGrid.scss";
import { useMemo } from "react";

export default function CrudDataGrid({
  rows,
  columns: initialColumns,
  loading,
  getRowId,
  components,
  componentsProps,
  onRowEditStop,
  onDeleteRow,
}) {
  const columns = useMemo(
    () => [
      ...initialColumns,
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<i className="bx bx-trash"></i>}
            label="Delete"
            onClick={() => onDeleteRow(params.id)}
          />,
        ],
      },
    ],
    [initialColumns, onDeleteRow]
  );

  return (
    <DataGrid
      className="crud-data-grid"
      rows={rows}
      columns={columns}
      loading={loading}
      getRowId={getRowId}
      editMode="row"
      onRowEditStop={onRowEditStop}
      components={components}
      componentsProps={componentsProps}
      disableSelectionOnClick
      headerHeight={40}
    />
  );
}
