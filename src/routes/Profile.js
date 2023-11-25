import { useState } from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import styled from "styled-components";
import { Briefcase, Envelope, House, Phone, Star } from "@phosphor-icons/react";
import ProjectsHistory from "../components/ProjectsHistory";
import Education from "../components/Education";
import useAppContext from "../hooks/useAppContextHook";
import ProfileForm from "../components/ProfileForm";
import { useEffect } from "react";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfileGridItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: whitesmoke;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 3px rgba(202, 239, 255, 0.43);
  padding: 1rem;
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
`;

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
`;

const ProgressBar = styled.div`
  background-color: #d2d4d6;
  height: 10px;
  border-radius: 10px;
`;

export default function Profile({ userProfile = null }) {
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({});
  // const [userData, setUserData] = useState({});

  const {
    appState: { user, profile: userData },
  } = useAppContext();

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    } else {
      setProfile(userData);
    }
  }, [userProfile]);

  return (
    <ProfileContainer>
      {userProfile ? null : <Typography variant="h5">Profile</Typography>}
      <Grid container spacing={2}>
        <Grid item md={4}>
          <ProfileGridItemContainer>
            <AvatarContainer>
              <Avatar src={`data:image/png;base64,${profile?.userImagePath}` || ""} sx={{ width: 150, height: 150 }} />
              <div>
                <Typography>
                  {profile?.firstName} {profile?.lastName}
                </Typography>
              </div>
            </AvatarContainer>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                paddingBottom: "0.5rem",
                borderBottom: "0.5px solid gray",
              }}
            >
              <IconTypography>
                <Briefcase color="#1976d2" />
                <Typography variant="subtitle1">{profile?.designation}</Typography>
              </IconTypography>
              <IconTypography>
                <House color="#1976d2" />
                <Typography variant="subtitle1">{profile?.address}</Typography>
              </IconTypography>
              <IconTypography>
                <Envelope color="#1976d2" />
                <Typography variant="subtitle1">{profile?.email}</Typography>
              </IconTypography>
              <IconTypography>
                <Phone color="#1976d2" />
                <Typography variant="subtitle1">{profile?.contactNumber}</Typography>
              </IconTypography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                paddingBottom: "0.5rem",
                borderBottom: "0.5px solid gray",
              }}
            >
              <IconTypography style={{ color: "black" }}>
                <Star color="#1976d2" />
                <Typography variant="subtitle1">Skills</Typography>
              </IconTypography>
              {profile?.skills &&
                Object.keys(profile?.skills).map((item) => (
                  <LabelTypography>
                    <Typography variant="subtitle1">
                      {item} ({profile?.skills[item]}%)
                    </Typography>
                    <ProgressBar>
                      <div
                        style={{
                          backgroundColor: "#1976d2",
                          height: "10px",
                          borderRadius: "10px",
                          width: profile?.skills[item] + "%",
                        }}
                      />
                    </ProgressBar>
                  </LabelTypography>
                ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                paddingBottom: "0.5rem",
                borderBottom: "0.5px solid gray",
              }}
            >
              <IconTypography style={{ color: "black" }}>
                <Star color="#1976d2" />
                <Typography variant="subtitle1">Languages</Typography>
              </IconTypography>
              {profile?.languages &&
                Object.keys(profile?.languages).map((item) => (
                  <LabelTypography>
                    <Typography variant="subtitle1">
                      {item} ({profile?.languages[item]}%)
                    </Typography>
                    <ProgressBar>
                      <div
                        style={{
                          backgroundColor: "#1976d2",
                          height: "10px",
                          borderRadius: "10px",
                          width: profile?.languages[item] + "%",
                        }}
                      />
                    </ProgressBar>
                  </LabelTypography>
                ))}
            </div>
          </ProfileGridItemContainer>
          {userProfile ? null : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Button variant="contained" size="small" onClick={() => setEditProfile(true)}>
                Edit Profile
              </Button>
            </div>
          )}
        </Grid>
        <Grid item md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ProfileGridItemContainer>
                <Education data={profile?.education} />
              </ProfileGridItemContainer>
            </Grid>
            <Grid item xs={12}>
              <ProfileGridItemContainer>
                <Education title="Experience" data={profile?.experience} />
              </ProfileGridItemContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {editProfile && <ProfileForm isEdit data={profile} onClose={() => setEditProfile(false)} />}
    </ProfileContainer>
  );
}
