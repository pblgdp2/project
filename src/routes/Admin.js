import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Pagination,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Projects from "./Projects";
import useUser from "../hooks/useUserHook";
import { Trash } from "@phosphor-icons/react";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Admin() {
  const pageSize = 10;

  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableDelete, setDisableDelete] = useState(false);

  const roles = {
    ROLE_USER: "User",
    ROLE_ADMIN: "Admin",
  };

  const { getAllUsers, deleteUser } = useUser();

  useEffect(() => {
    if (value === 1) {
      setLoading(true);
      getAllUsers()
        .then((data) => {
          setData(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDeleteUser = async (item) => {
    try {
      setDisableDelete(true);
      await deleteUser(item.email);
      setLoading(true);
      getAllUsers()
        .then((data) => {
          setData(data);
        })
        .catch(console.error)
        .finally(() => {
          setDisableDelete(false);
          setLoading(false);
        });
    } catch (error) {}
  };

  return (
    <div>
      <Box>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Approve / Reject" />
          <Tab label="Users" />
        </Tabs>
      </Box>
      {value === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <Projects filterBy="all" isAdmin showSearch showSearchPagination />
        </div>
      )}
      {value === 1 && (
        <div style={{ marginTop: "1rem" }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th">ID</TableCell>
                    <TableCell component="th">Email</TableCell>
                    <TableCell component="th">Mobile</TableCell>
                    <TableCell component="th">Name</TableCell>
                    <TableCell component="th">Roles</TableCell>
                    {/* <TableCell component="th"></TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell style={{ width: 20 }}>{row.id}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{roles[row.roles] || JSON.stringify(row.roles)}</TableCell>
                      {/* <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => handleDeleteUser(row)} disabled={disableDelete}>
                          <Trash />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Pagination
                        count={Math.ceil(data.length / pageSize)}
                        page={currentPage}
                        color="primary"
                        onChange={(e, page) => {
                          setCurrentPage(page);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          )}
        </div>
      )}
    </div>
  );
}
