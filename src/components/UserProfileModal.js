import { useState, useEffect } from "react";
import { Modal, Box, IconButton, CircularProgress, Typography } from "@mui/material";
import Profile from "../routes/Profile";
import { XCircle } from "@phosphor-icons/react";
import useUser from "../hooks/useUserHook";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  border: "none",
  outline: "none",
  height: "90%",
};

export default function UserProfileModal({ userEmail = null, onClose = () => {} }) {
  const [userProfile, setUserProfile] = useState(null);

  const { getUserProfile } = useUser();

  useEffect(() => {
    if (userEmail) {
      getUserProfile(userEmail, null, true).then(setUserProfile).catch(console.error);
    }
  }, [userEmail]);

  return (
    <Modal open={true}>
      <Box sx={{ ...style }}>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "0.5rem" }}>
          <IconButton style={{ backgroundColor: "white", padding: "0" }} size="large" color="error" onClick={onClose}>
            <XCircle />
          </IconButton>
        </div>
        <div style={{ backgroundColor: "whitesmoke", borderRadius: "10px", padding: "1rem", maxHeight: "90%", overflowY: "auto" }}>
          {userProfile ? (
            <Profile userProfile={userProfile} />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "1rem", gap: "0.5rem" }}>
              <CircularProgress />
              <Typography>Loading, Please wait</Typography>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}
