import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import useUser from "../hooks/useUserHook";

const ForgotPasswordContainer = styled.div`
  border-radius: 1rem;
  box-shadow: 0px 0px 5px 0px rgba(202, 239, 255, 0.43);
  padding: 1rem;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default function ForgotPassword({ onForgotPasswordClose = () => {} }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [disableEmail, setDisableEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { forgotPassword, changePassword } = useUser();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (!disableEmail) {
        if (!email) throw new Error("Please enter Email");
        setDisableEmail(true);
        await forgotPassword(email);
      } else {
        if (!code) throw new Error("Please enter the code");
        if (password.trim() && password !== confirmPassword) throw new Error("Entered Passwords doesn't match");
        await changePassword({ email, code, password });
        onForgotPasswordClose();
      }
    } catch (error) {
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <Typography variant="h5">Forgot Password</Typography>
      <TextField
        variant="outlined"
        size="small"
        required
        label="Username"
        value={email}
        disabled={disableEmail}
        onChange={(e) => setEmail(e.target.value)}
      />
      {disableEmail && (
        <>
          <TextField
            variant="outlined"
            size="small"
            label="Code"
            value={code}
            disabled={loading}
            required
            onChange={(e) => setCode(/^[0-9]*$/.test(e.target.value) ? e.target.value : code)}
          />
          <TextField
            variant="outlined"
            size="small"
            label="Password"
            value={password}
            type="password"
            disabled={loading}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            size="small"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            disabled={loading}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      )}
      <Button size="small" onClick={handleSubmit} disabled={loading}>
        {disableEmail ? "Continue" : "Submit"}
      </Button>

      {error && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        </div>
      )}

      <div>
        <Button size="small" color="error" onClick={onForgotPasswordClose} disabled={loading}>
          Back to login
        </Button>
      </div>
    </ForgotPasswordContainer>
  );
}
