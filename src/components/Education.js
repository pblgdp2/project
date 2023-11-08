import { Typography } from "@mui/material";
import { GraduationCap } from "@phosphor-icons/react";
import styled from "styled-components";
import EducationDetails from "./EducationDetails";

const EducationContainer = styled.div`
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

export default function Education({ data = [] }) {
  return (
    <EducationContainer>
      <IconTypography style={{ color: "black" }}>
        <GraduationCap color="#1976d2" size={25} />
        <Typography variant="h6">Education</Typography>
      </IconTypography>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {data?.map((item) => (
          <EducationDetails isCurrent={item?.endDate ? false : true} data={item} />
        ))}
      </div>
    </EducationContainer>
  );
}
