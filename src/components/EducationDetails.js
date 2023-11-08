import { Chip, Typography } from "@mui/material";
import styled from "styled-components";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from 'moment';

const IconTypography = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: gray;
`;

const LabelTypography = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: gray;
  padding-bottom: 1rem;
`;

export default function EducationDetails({ isCurrent, data = {} }) {
  const { degreeType, endDate, startDate, universityName } = data;
  return (
    <LabelTypography>
      <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
        {universityName}
      </Typography>
      <IconTypography>
        <CalendarMonthIcon fontSize="small" />
        <Typography variant="body2">
          {startDate && moment(new Date(startDate)).format("MMM YYYY")} -{" "}
          {isCurrent ? (
            <Chip label="Current" size="small" color="primary" />
          ) : (
            endDate && moment(new Date(endDate)).format("MMM YYYY")
          )}
        </Typography>
      </IconTypography>
      <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
        {degreeType}
      </Typography>
    </LabelTypography>
  );
}
