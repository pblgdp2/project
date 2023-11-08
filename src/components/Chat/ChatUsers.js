import { Badge, Button, Collapse, IconButton, TextField, Typography } from "@mui/material";
import { MagnifyingGlass, Minus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useAppContext from "../../hooks/useAppContextHook";

const ChatUserContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 275px;
  background-color: #d7daf7;
  border: 0.5px solid #d7daf7;
`;

const ChatUserCardContainer = styled.div`
  padding-inline: 1rem;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.5px solid #b8c2cf;
  cursor: pointer;
`;

export default function ChatUsers({ users = [], onStartChat = () => {}, onClickUser = () => {} }) {
  const [show, setShow] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  let isUnread = false;
  users.forEach(({ unread = false }) => {
    if (unread) {
      isUnread = true;
      return;
    }
  });

  const {
    appState: {
      user: { username },
    },
  } = useAppContext();

  useEffect(() => {
    setFilteredUsers([...users]);
  }, [users]);

  const handleFilter = (e) => {
    const { value } = e.target;
    const usersData = users.filter((item) => item.recipient?.toLowerCase().includes(value.toLowerCase()));
    setFilteredUsers([...usersData]);
    setSearchVal(value);
  };

  return (
    <ChatUserContainer>
      <Collapse in={!show}>
        <ChatUserCardContainer
          onClick={() => setShow(true)}
          style={{
            borderBottom: "none",
            ...(isUnread
              ? {
                  backgroundColor: "#7c87f6",
                }
              : {}),
          }}
        >
          <Typography variant="subtitle2">Chat</Typography>
        </ChatUserCardContainer>
      </Collapse>
      <Collapse in={show}>
        <ChatUserCardContainer style={{ padding: "0.5rem" }}>
          <TextField
            size="small"
            placeholder="Search"
            fullWidth
            InputProps={{ endAdornment: <MagnifyingGlass /> }}
            value={searchVal}
            onChange={handleFilter}
          />
          <IconButton size="small" onClick={() => setShow(false)}>
            <Minus />
          </IconButton>
        </ChatUserCardContainer>
        {filteredUsers?.length <= 0 ? (
          <ChatUserCardContainer style={{ padding: "0.5rem" }}>
            <Button
              variant="contained"
              fullWidth
              disabled={searchVal.trim() && username !== searchVal.trim() ? false : true}
              onClick={() => {
                onStartChat(searchVal.trim());
                setFilteredUsers([...users]);
                setShow(false);
                setSearchVal("");
              }}
            >
              Start Chat
            </Button>
          </ChatUserCardContainer>
        ) : null}
        {filteredUsers.map((item) => (
          <ChatUserCard key={item?.recipient} data={item} onClickUser={() => onClickUser(item)} />
        ))}
      </Collapse>
    </ChatUserContainer>
  );
}

function ChatUserCard({ data = {}, onClickUser = () => {} }) {
  return (
    <ChatUserCardContainer
      onClick={onClickUser}
      style={{
        ...(data?.unread
          ? {
              backgroundColor: "#7c87f6",
            }
          : {}),
      }}
    >
      <Typography variant="body2">{data?.recipient}</Typography>
      <Badge color="primary"></Badge>
    </ChatUserCardContainer>
  );
}
