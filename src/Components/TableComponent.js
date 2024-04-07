import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getFormatedData, secondsToString } from "../Utility/UtilityFunction";

// Define a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const TableComponent = ({ tableRowData, showHours }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <TableContainer component={Paper} sx={{ backgroundColor: "#151a2b" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Ranking </TableCell>
              <TableCell>Agent Id</TableCell>
              <TableCell>Agent Name</TableCell>
              <TableCell>Website URL</TableCell>
              <TableCell>Active Time</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRowData.map((tableItem, index) => {
              return (
                <TableRow
                  onClick={() => console.log("test")}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{tableItem.agent_id}</TableCell>
                  <TableCell>{tableItem.agent_name}</TableCell>
                  <TableCell>{tableItem.website_url}</TableCell>
                  <TableCell>
                    {showHours
                      ? tableItem.active_time
                      : secondsToString(tableItem.active_time)}
                  </TableCell>
                  <TableCell>{getFormatedData(tableItem.date)}</TableCell>
                </TableRow>
              );
            })}

            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default TableComponent;
