import { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import useUser from "../hooks/useUserHook";

const validations = {
  firstName: "Please enter First Name",
  lastName: "Please enter Last Name",
  email: "Please enter Email",
  password: "Please enter Password",
  confirmPassword: "Please enter Confirm Password",
};

export default function Signup({ setShowLogin = () => {} }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    // name: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: "",
    confirmPassword: "",
    code: "",
  });
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const { userSignUp, sendCode } = useUser();

  const checkValidation = (data) => {
    let error = "";
    Object.keys(validations).forEach((item) => {
      if (!error && !data[item]) {
        error = validations[item];
      }
    });
    return error;
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const { firstName, lastName, email, password, confirmPassword, roles, code } = data;
      const validationMsg = checkValidation(data);
      if (validationMsg) throw new Error(validationMsg);
      if (password !== confirmPassword) throw new Error("Password's doesn't match");
      if (codeSent) {
        if (code.trim() == "") throw new Error("Please enter the OTP received in the email");
        const obj = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          password: password,
          roles: roles === "ROLE_ADMIN" ? roles : "",
          code,
        };
        await userSignUp(obj);
        setShowLogin(true);
      } else {
        setCodeSent(true);
        await sendCode(email);
      }
    } catch (error) {
      setCodeSent(false);
      setError(error.message || "Something went wrong while signing up");
    } finally {
      setLoading(false);
    }
  };

  const onValueChange = (e) => {
    const { value, name } = e.target;
    if (name === "code") {
      setData((prevState) => ({
        ...prevState,
        code: /^[0-9]*$/.test(value) ? value : prevState.code,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <Typography variant="h5">Signup</Typography>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <TextField
          size="small"
          variant="outlined"
          label="First Name"
          name="firstName"
          required
          value={data.firstName}
          disabled={codeSent}
          onChange={onValueChange}
        />
        <TextField
          size="small"
          variant="outlined"
          label="Last Name"
          name="lastName"
          required
          value={data.lastName}
          disabled={codeSent}
          onChange={onValueChange}
        />
      </div>
      <TextField size="small" variant="outlined" label="Email" name="email" value={data.email} disabled={codeSent} onChange={onValueChange} />
      <TextField
        size="small"
        variant="outlined"
        label="Password"
        type="password"
        required
        value={data.password}
        disabled={codeSent}
        name="password"
        onChange={onValueChange}
      />
      <TextField
        size="small"
        variant="outlined"
        label="Confirm Password"
        value={data.confirmPassword}
        type="password"
        name="confirmPassword"
        required
        disabled={codeSent}
        onChange={onValueChange}
      />
      {codeSent ? <TextField size="small" variant="outlined" label="OTP" required value={data.code} name="code" onChange={onValueChange} /> : null}
      <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
        {codeSent ? "Signup" : "Continue"}
      </Button>
      {error && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        </div>
      )}
      {/* <Typography variant="caption" style={{ display: "flex", justifyContent: "center" }}>
            (or)
        </Typography> */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Typography variant="body1">Back to</Typography>
        <Button variant="text" color="primary" onClick={() => setShowLogin(true)} size="small" disabled={loading}>
          Login
        </Button>
      </div>
      {/* <div style={{ display: "flex", justifyContent: "center" }}>
      </div> */}
    </>
  );
}
