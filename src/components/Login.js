import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import useAppContext from "../hooks/useAppContextHook";
import { useState } from "react";
import useUser from "../hooks/useUserHook";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

const LoginContainer = styled.div`
  border-radius: 1rem;
  box-shadow: 0px 0px 5px 0px rgba(202, 239, 255, 0.43);
  padding: 1rem;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "none",
  outline: "none",
};

export default function Login({ showCancel = false, onClose = () => {} }) {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
    code: "",
  });

  const { userLogin, getUserProfile } = useUser();

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrors({});
    try {
      const errorsObj = {};
      if (!email.trim()) errorsObj.email = "Username is required";
      if (!password.trim()) errorsObj.password = "Password is required";
      setErrors(errorsObj);

      if (Object.keys(errorsObj).length > 0) return;

      const { token, username } = await userLogin({
        username: email,
        password,
      });
      await getUserProfile(username, token);
      // window.location.reload();
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        general: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
  };

  return (
    <Modal open={true}>
      <Box sx={{ ...style }}>
        {showForgotPassword ? (
          <ForgotPassword onForgotPasswordClose={handleForgotPasswordClose} />
        ) : showLogin ? (
          <LoginContainer>
            <Typography variant="h5">Login</Typography>
            <TextField
              required
              variant="outlined"
              label="Username"
              size="small"
              value={email}
              {...(errors?.email
                ? {
                    error: true,
                    helperText: errors.email,
                  }
                : {})}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              variant="outlined"
              label="Password"
              type="password"
              size="small"
              value={password}
              {...(errors?.password
                ? {
                    error: true,
                    helperText: errors.password,
                  }
                : {})}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl size="small">
              <InputLabel>User Type</InputLabel>
              <Select label="User Type" size="small" defaultValue="ROLE_USER">
                <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                <MenuItem value="ROLE_USER">User</MenuItem>
                <MenuItem value="ROLE_GUEST">Guest</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="success" onClick={handleLogin} disabled={loading}>
              Login
            </Button>
            {errors?.general && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="caption" color="error">
                  {errors.general}
                </Typography>
              </div>
            )}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Typography variant="body1">Forgot password?</Typography>
                <Button variant="text" color="primary" onClick={() => setShowForgotPassword(true)} disabled={loading} size="small">
                  Click here
                </Button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Typography variant="body1">Not a User?</Typography>
                <Button variant="text" color="primary" onClick={() => setShowLogin(false)} disabled={loading} size="small">
                  Signup
                </Button>
              </div>
            </div>
            {showCancel && (
              <div>
                <Button size="small" color="error" onClick={onClose} disabled={loading}>
                  Back
                </Button>
              </div>
            )}
          </LoginContainer>
        ) : (
          <LoginContainer>
            <Signup setShowLogin={setShowLogin} />
          </LoginContainer>
        )}
      </Box>
    </Modal>
  );
}
