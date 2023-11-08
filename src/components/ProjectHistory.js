import { Typography } from "@mui/material";
import styled from "styled-components";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const IconTypography = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: gray;
`;

const LabelTypography = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    color: gray;
    padding-bottom: 1rem;
`;

export default function ProjectHistory() {
    return <LabelTypography style={{ borderBottom: "0.5px solid gray" }}>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>Professional Based Learning</Typography>
        <IconTypography>
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="body2">{new Date().toLocaleDateString()}</Typography>
        </IconTypography>
        <Typography variant="body1" >Professional based learning refers to an approach to education that focuses on acquiring practical skills and knowledge.</Typography>
    </LabelTypography>
}