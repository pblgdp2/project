import { useRef, useState, useEffect } from "react";
import { IconButton, Typography } from "@mui/material";
import styled from "styled-components";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Trash } from "@phosphor-icons/react";

const AttachmentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AttachmentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 0.5rem;
  border: 1px dashed gray;
  border-radius: 10px;
`;

export default function Attachments({
  title = "",
  onAttachment = () => {},
  multiple = true,
}) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    onAttachment(files.map((item) => item.base64));
  }, [files]);

  const removeBase64Metadata = (base64String) => {
    // Find the index of the comma in the base64 string
    const commaIndex = base64String.indexOf(",");

    // Extract and return the base64 data without metadata
    return base64String.slice(commaIndex + 1);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = [];
    const dataFiles = e.target.files || e.dataTransfer.files;
    for (let x in dataFiles) {
      const file = dataFiles[x];
      if (!multiple && x >= 1) {
        return;
      }
      if (file.type === "image/png") {
        const reader = new FileReader();
        reader.onload = (event) => {
          newFiles.push({
            name: file.name,
            id: file.name + new Date().getTime(),
            base64: removeBase64Metadata(event.target.result),
          });
          setFiles([...files, ...newFiles]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDelete = (id) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    setFiles(updatedFiles);
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  return (
    <AttachmentContainer onDrop={handleDrop} onDragOver={handleDragOver}>
      {title && <Typography variant="subtitle1">{title}</Typography>}
      <AttachmentBox onClick={handleBoxClick}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleDrop}
          accept=".png"
          multiple={multiple}
          style={{ display: "none" }}
        />
        <FileUploadIcon fontSize="large" color="info" />
        <Typography variant="caption">
          Click or Drag and Drop files to upload
        </Typography>
      </AttachmentBox>
      <div style={{ display: "flex", gap: "1rem" }}>
        {files.map((file) => (
          <div
            key={file.id}
            style={{ margin: "10px", position: "relative", width: "100px" }}
          >
            <IconButton
              onClick={() => handleDelete(file.id)}
              size="small"
              style={{
                position: "absolute",
                right: "0",
                backgroundColor: "white",
              }}
            >
              <Trash color="red" fontSize={15} />
            </IconButton>
            <img
              src={`data:image/png;base64,${file.base64}`}
              alt={file.name}
              style={{ width: "100px", maxHeight: "100px" }}
            />
          </div>
        ))}
      </div>
    </AttachmentContainer>
  );
}
