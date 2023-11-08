import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Projects from "./Projects";
import styled from "styled-components";
import useAppContext from "../hooks/useAppContextHook";

const MyProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export default function MyProjects() {
  const [status, setStatus] = useState("all");
  const [filterData, setFilterData] = useState({
    approvedStatus: [true, false, null],
    status: ["COMPLETED", "DRAFT", "PENDING"],
    visibility: [true, false],
  });

  const {
    appState: {
      user: { username },
    },
  } = useAppContext();

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setStatus(value);
    let filterDataObj = {
      approvedStatus: [true, false, null],
      status: ["COMPLETED", "DRAFT", "PENDING"],
      visibility: [true, false],
    };
    switch (value) {
      case "public":
        filterDataObj.visibility = [true];
        break;
      case "private":
        filterDataObj.visibility = [false];
        break;
      case "completed":
        filterDataObj.status = ["COMPLETED"];
        break;
      case "pending":
        filterDataObj.status = ["PENDING"];
        break;
      case "draft":
        filterDataObj.status = ["DRAFT"];
        break;
      case "approved":
        filterDataObj.approvedStatus = [true];
        break;
      case "rejected":
        filterDataObj.approvedStatus = [false];
        break;
    }
    setFilterData({ ...filterDataObj });
  };

  return (
    <MyProjectsContainer>
      <FilterContainer>
        <FormControl style={{ maxWidth: "300px" }} fullWidth size="small">
          <InputLabel>Filter By</InputLabel>
          <Select label="Filter By" fullWidth size="small" value={status} onChange={handleStatusChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </FilterContainer>
      <Projects myProjects filterData={filterData} />
    </MyProjectsContainer>
  );
}
