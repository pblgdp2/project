import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Plus, Trash } from "@phosphor-icons/react";
import styled from "styled-components";
import useAppContext from "../hooks/useAppContextHook";
import useUser from "../hooks/useUserHook";
import moment from "moment";
import Attachments from "./Attachments";

const ProfileFormContainer = styled.div`
  border-radius: 1rem;
  box-shadow: 0px 0px 5px 0px rgba(202, 239, 255, 0.43);
  padding: 1rem;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 80vh;
  overflow-y: auto;
`;

const FormFooter = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  border: "none",
  outline: "none",
};

const validations = {
  firstName: "Please enter First Name",
  lastName: "Please enter Last Name",
  userImagePath: "Please upload profile image",
  userimagePath: "Please upload profile image",
  address: "Please enter your address",
  contactNumber: "Please enter Contact Number",
  designation: "Please enter Designation",
};

export default function ProfileForm({ isEdit = false, data = {}, onClose = () => {} }) {
  const [userData, setUserData] = useState(
    isEdit
      ? data
      : {
          firstName: "",
          lastName: "",
          userimagePath: "",
          designation: "",
          address: "",
          email: "",
          contactNumber: "",
          skills: {},
          languages: {},
          education: [],
          experience: [],
        }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    appState: {
      user: { name, username },
    },
  } = useAppContext();
  const { addProfile, updateProfile } = useUser();

  const handleSkills = (data = []) => {
    setUserData((prevState) => ({
      ...prevState,
      skills: data.reduce(
        (acc, item) => ({
          ...acc,
          [item.key]: parseInt(item.value),
        }),
        {}
      ),
    }));
  };

  const handleLangauges = (data) => {
    setUserData((prevState) => ({
      ...prevState,
      languages: data.reduce(
        (acc, item) => ({
          ...acc,
          [item.key]: parseInt(item.value),
        }),
        {}
      ),
    }));
  };

  const handleEducation = (data) => {
    setUserData((prevState) => ({
      ...prevState,
      education: data,
    }));
  };

  const handleExperience = (data) => {
    setUserData((prevState) => ({
      ...prevState,
      experience: data,
    }));
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
    setLoading(true);
    setError("");
    try {
      const validationMsg = checkValidation({
        ...userData,
        userImagePath: userData?.userimagePath || userData?.userImagePath || data?.userImagePath || data?.userimagePath,
        userimagePath: userData?.userimagePath || userData?.userImagePath || data?.userImagePath || data?.userimagePath,
      });
      if (validationMsg) throw new Error(validationMsg);
      if (isEdit) {
        await updateProfile({ ...userData, userImagePath: userData?.userImagePath || data?.userImagePath, email: username });
        onClose();
      } else {
        await addProfile({ ...userData, email: username });
      }
    } catch (error) {
      setError(error?.message || "Something went wrong, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true}>
      <Box sx={{ ...style }}>
        <ProfileFormContainer>
          <Typography variant="h5">{isEdit ? "Edit " : ""}User Profile</Typography>
          <Attachments
            title="Profile Photo"
            multiple={false}
            onAttachment={(value) => {
              handleValueChange({
                target: {
                  value: (value && value[0]) || "",
                  name: "userImagePath",
                },
              });
            }}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <TextField size="small" fullWidth label="First Name" required name="firstName" value={userData.firstName} onChange={handleValueChange} />
            <TextField size="small" fullWidth label="Last Name" required name="lastName" value={userData.lastName} onChange={handleValueChange} />
          </div>
          <TextField size="small" label="Designation" required name="designation" value={userData.designation} onChange={handleValueChange} />
          <TextField size="small" label="Email" name="email" required disabled value={userData.email || username} onChange={handleValueChange} />
          <TextField size="small" label="Contact Number" required name="contactNumber" value={userData.contactNumber} onChange={handleValueChange} />
          <TextField size="small" label="Address" required name="address" value={userData.address} onChange={handleValueChange} />
          <SkillsLanguages title="Skills" onData={handleSkills} initialData={userData?.skills} />
          <SkillsLanguages title="Langauges" onData={handleLangauges} initialData={userData?.languages} />
          <Education onData={handleEducation} initialData={userData?.education} />
          <Experience onData={handleExperience} initialData={userData?.experience || []} />
          {error && (
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            </div>
          )}
          <FormFooter>
            <Button variant="contained" size="small" onClick={handleSubmit} disabled={loading}>
              {isEdit ? "Update" : "Save"}
            </Button>
            {isEdit && (
              <Button variant="contained" size="small" color="error" onClick={onClose}>
                Cancel
              </Button>
            )}
          </FormFooter>
        </ProfileFormContainer>
      </Box>
    </Modal>
  );
}

function SkillsLanguages({ title = "", onData = () => {}, initialData = {} }) {
  const [inputKey, setInputKey] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [data, setData] = useState(
    Object.keys(initialData).map((item) => ({
      key: item,
      value: initialData[item],
    }))
  );

  useEffect(() => {
    onData(data);
  }, [data]);

  const handleSubmit = () => {
    if (inputKey.trim() && inputVal.trim()) {
      setData((prevState) => [
        ...prevState,
        {
          key: inputKey,
          value: inputVal,
        },
      ]);
      setInputKey("");
      setInputVal("");
    }
  };

  const handleRemove = (index) => {
    setData((prevState) => {
      prevState.splice(index, 1);
      return [...prevState];
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        border: "0.5px solid gray",
        padding: "1rem",
        borderRadius: "10px",
      }}
    >
      <Typography variant="body1">{title}</Typography>
      {data.length > 0
        ? data.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "0.5rem",
                border: "0.5px solid gray",
                borderRadius: "10px",
              }}
            >
              <Typography variant="body2">
                {item?.key}: {item?.value}%
              </Typography>
              <IconButton size="small" color="error" onClick={() => handleRemove(index)}>
                <Trash fontSize={15} />
              </IconButton>
            </div>
          ))
        : null}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <TextField size="small" label="Key" value={inputKey} onChange={(e) => setInputKey(e.target.value)} />
        <TextField size="small" label="Value (%)" type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
        <IconButton size="small" color="primary" onClick={handleSubmit}>
          <Plus fontSize={15} />
        </IconButton>
      </div>
    </div>
  );
}

function Education({ onData = () => {}, initialData = [] }) {
  const [educationData, setEducationData] = useState({
    universityName: "",
    degreeType: "",
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState(initialData);

  useEffect(() => {
    onData(data);
  }, [data]);

  const handleAdd = () => {
    const { universityName, degreeType } = educationData;
    if (universityName.trim() && degreeType.trim()) {
      setData((prevState) => [...(prevState || []), educationData]);
      setEducationData({
        universityName: "",
        degreeType: "",
        startDate: "",
        endDate: "",
      });
    }
  };

  const handleRemove = (index) => {
    setData((prevState) => {
      prevState.splice(index, 1);
      return [...prevState];
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        border: "0.5px solid gray",
        padding: "1rem",
        borderRadius: "10px",
      }}
    >
      <Typography variant="body1">Education</Typography>
      {data.length > 0
        ? data.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "0.5rem",
                border: "0.5px solid gray",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Typography variant="body2">University: {item.universityName}</Typography>
                <Typography variant="body2">Degree: {item.degreeType}</Typography>
                <Typography variant="body2">
                  Start Date: {item.startDate ? moment(new Date(item.startDate)).format("MMM YYYY") : "Present"}
                </Typography>
                <Typography variant="body2">End Date: {item.endDate ? moment(new Date(item.endDate)).format("MMM YYYY") : "Present"}</Typography>
              </div>
              <IconButton size="small" color="error" onClick={() => handleRemove(index)}>
                <Trash fontSize={15} />
              </IconButton>
            </div>
          ))
        : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <TextField size="small" label="University" fullWidth name="universityName" value={educationData?.universityName} onChange={handleChange} />
          <TextField size="small" label="Degree" fullWidth name="degreeType" value={educationData?.degreeType} onChange={handleChange} />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <TextField
            size="small"
            label="Start Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            name="startDate"
            value={educationData?.startDate}
            onChange={handleChange}
          />
          <TextField
            size="small"
            label="End Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            name="endDate"
            value={educationData?.endDate}
            onChange={handleChange}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button size="small" variant="outlined" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

function Experience({ onData = () => {}, initialData = [] }) {
  const [experienceData, setExperienceData] = useState({
    company: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState(initialData);

  useEffect(() => {
    onData(data);
  }, [data]);

  const handleAdd = () => {
    const { company, description } = experienceData;
    if (company.trim() && description.trim()) {
      setData((prevState) => [...(prevState || []), experienceData]);
      setExperienceData({
        company: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    }
  };

  const handleRemove = (index) => {
    setData((prevState) => {
      prevState.splice(index, 1);
      return [...prevState];
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperienceData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        border: "0.5px solid gray",
        padding: "1rem",
        borderRadius: "10px",
      }}
    >
      <Typography variant="body1">Experience</Typography>
      {data.length > 0
        ? data.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "0.5rem",
                border: "0.5px solid gray",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Typography variant="body2">Company: {item.company}</Typography>
                <Typography variant="body2">Description: {item.description}</Typography>
                <Typography variant="body2">
                  Start Date: {item.startDate ? moment(new Date(item.startDate)).format("MMM YYYY") : "Present"}
                </Typography>
                <Typography variant="body2">End Date: {item.endDate ? moment(new Date(item.endDate)).format("MMM YYYY") : "Present"}</Typography>
              </div>
              <IconButton size="small" color="error" onClick={() => handleRemove(index)}>
                <Trash fontSize={15} />
              </IconButton>
            </div>
          ))
        : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <TextField size="small" label="Company" fullWidth name="company" value={experienceData?.company} onChange={handleChange} />
        <TextField size="small" label="Description" fullWidth name="description" value={experienceData?.description} onChange={handleChange} />
        <div style={{ display: "flex", gap: "1rem" }}>
          <TextField
            size="small"
            label="Start Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            name="startDate"
            value={experienceData?.startDate}
            onChange={handleChange}
          />
          <TextField
            size="small"
            label="End Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            name="endDate"
            value={experienceData?.endDate}
            onChange={handleChange}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button size="small" variant="outlined" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
