import styled from "styled-components";
import { Briefcase, Envelope, House, Phone, Star } from '@phosphor-icons/react';
import { Pagination, Typography } from "@mui/material";
import ProjectHistory from "./ProjectHistory";

const ProjectsHistoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const IconTypography = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: gray;
`;

export default function ProjectsHistory() {
    return <ProjectsHistoryContainer>
        <IconTypography style={{ color: "black" }}>
            <Briefcase color="#1976d2" size={25} />
            <Typography variant="h6">Projects History</Typography>
        </IconTypography>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <ProjectHistory />
            <ProjectHistory />
            <ProjectHistory />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Pagination count={10} color="primary" />
            </div>
        </div>
    </ProjectsHistoryContainer>
}