import { useEffect, useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import useProject from "../hooks/useProjectHook";
import ProjectCard from "../components/ProjectCard";
import useAppContext from "../hooks/useAppContextHook";

export default function Requests() {
  const [value, setValue] = useState(0);
  const [approved, setApproved] = useState([]);
  const [pending, setPending] = useState([]);
  const [requested, setRequested] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getapprovedAndUnApproved, getRequestedApprovals, approveProjectRequest } = useProject();
  const {
    appState: {
      user: { username },
    },
  } = useAppContext();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { approved, pending } = await getapprovedAndUnApproved();
        setApproved(approved);
        setPending(pending);
        const { response } = await getRequestedApprovals();
        const dataArr = response?.filter((item) => {
          return Object.values(item?.projectRequests).includes(false);
        });
        setRequested([...dataArr]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleApproveProjectRequest = async (user, id) => {
    try {
      await approveProjectRequest(user, id);
      getRequestedApprovals().then((data) => {
        const { response } = data;
        const dataArr = response?.filter((item) => {
          return Object.values(item?.projectRequests).includes(false);
        });
        setRequested([...dataArr]);
      });
    } catch (error) {}
  };

  return (
    <div>
      <Box>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Approved Requests" />
          <Tab label="Pending Approval" />
          <Tab label="Requested Approval" />
        </Tabs>
      </Box>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        {value === 0 && <ApprovedRequests data={approved} loading={loading} />}
        {value === 1 && <PendingRequests data={pending} loading={loading} />}
        {value === 2 && <RequestApproval data={requested} loading={loading} onApproveProjectRequest={handleApproveProjectRequest} />}
      </div>
    </div>
  );
}

function ApprovedRequests({ data = [], loading = false }) {
  return data.length ? (
    data.map((item) => <ProjectCard key={item.id} data={item} addComment={false} showUserProfile />)
  ) : loading ? (
    <Typography>Loading...</Typography>
  ) : (
    <Typography>No Data Found</Typography>
  );
}

function PendingRequests({ data = [], loading = false }) {
  return data.length ? (
    data.map((item) => <ProjectCard key={item.id} data={item} addComment={false} showUserProfile />)
  ) : loading ? (
    <Typography>Loading...</Typography>
  ) : (
    <Typography>No Data Found</Typography>
  );
}

function RequestApproval({ data = [], onApproveProjectRequest = () => {}, loading = false }) {
  return data.length ? (
    data.map((item) => (
      <ProjectCard
        key={item.id}
        data={item}
        addComment={false}
        showProjectApprovalRequests
        onApproveProjectRequest={(user) => onApproveProjectRequest(user, item.id)}
        showUserProfile
      />
    ))
  ) : loading ? (
    <Typography>Loading...</Typography>
  ) : (
    <Typography>No Data Found</Typography>
  );
}
