import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./basicTable.scss";

const BasicTable = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple-table">
        <TableHead>
          <TableRow>
            {props.columns.map((c, i) => {
              return i === 0 ? (
                <TableCell key={i}>{c}</TableCell>
              ) : (
                <TableCell key={i} align="right">
                  {c}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>{props.rows.map((r) => createTableRow(r))}</TableBody>
      </Table>
    </TableContainer>
  );
};

const createTableRow = (row) => {
  return (
    <TableRow
      key={Object.values(row)[0]}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      {Object.values(row).map((value, i) => {
        return i === 0 ? (
          <TableCell key={i} component="th" scope="row">
            {value}
          </TableCell>
        ) : (
          <TableCell key={i} align="right">
            {value}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default BasicTable;
