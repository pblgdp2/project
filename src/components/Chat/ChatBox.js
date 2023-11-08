import { Collapse, IconButton, TextField, Typography } from "@mui/material";
import { PaperPlaneRight, XCircle } from "@phosphor-icons/react";
import styled from "styled-components";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import fb from "../../utils/firebase";
import useAppContext from "../../hooks/useAppContextHook";

const { app, firebase } = fb;

const ChatBoxContainer = styled.div`
  display: flex;
  width: 250px;
  flex-direction: column;
  border: 1px solid #d7daf7;
`;

const ChatBoxHeader = styled.div`
  height: 40px;
  background-color: #d7daf7;
  display: flex;
  align-items: center;
  padding-inline: 1rem;
  justify-content: space-between;
  cursor: pointer;
`;

const ChatBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: 300px;
  background-color: #f2f3fd;
  padding: 0.5rem;
`;

const ChatBoxFooter = styled.div`
  height: 40px;
  background-color: #ecedfb;
  padding: 0.5rem;
`;

const MyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const MessageBackground = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #dfdfdf;
  background-color: white;
  border-radius: 4px;
  padding: 0.25rem;
  padding-inline: 0.5rem;
  gap: 0.25rem;
`;

const TheirMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export default function ChatBox({ data = {}, onSendMessage = () => {}, onChatRemove = () => {} }) {
  const [show, setShow] = useState(true);
  const [val, setVal] = useState("");
  const [messages, setMessages] = useState([]);

  const {
    appState: {
      user: { username },
    },
  } = useAppContext();

  useEffect(() => {
    const unsubscribe = app
      .collection("chats")
      .where("username", "in", [username, data?.recipient])
      .where("recipient", "in", [username, data?.recipient])
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setMessages((snapshot.docs || []).map((doc) => doc.data()));
      });
    return () => unsubscribe();
  }, []);

  return (
    <ChatBoxContainer>
      <ChatBoxHeader>
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center" }} onClick={() => setShow((prevState) => !prevState)}>
          <Typography variant="body2">{data?.recipient}</Typography>
        </div>
        <IconButton size="small" onClick={() => onChatRemove(data)}>
          <XCircle />
        </IconButton>
      </ChatBoxHeader>
      <Collapse in={show}>
        <ChatBoxContent>
          {messages.map((item) =>
            item?.username === username ? (
              <MyMessage key={item.timestamp}>
                <MessageBackground>
                  <Typography variant="caption" lineHeight="1.2">
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="GrayText" fontSize="10px" lineHeight="1">
                    {moment(new Date(item.timestamp)).fromNow()}
                  </Typography>
                </MessageBackground>
              </MyMessage>
            ) : (
              <TheirMessage key={item.timestamp}>
                <MessageBackground>
                  <Typography variant="caption" lineHeight="1.2">
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="GrayText" fontSize="10px" lineHeight="1">
                    {moment(new Date(item.timestamp)).fromNow()}
                  </Typography>
                </MessageBackground>
              </TheirMessage>
            )
          )}
        </ChatBoxContent>
        <ChatBoxFooter>
          <TextField
            size="small"
            fullWidth
            value={val}
            onChange={(e) => setVal(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  disabled={val.trim() ? false : true}
                  size="small"
                  onClick={() => {
                    onSendMessage({
                      ...data,
                      value: val.trim(),
                    });
                    setVal("");
                  }}
                >
                  <PaperPlaneRight />
                </IconButton>
              ),
            }}
          />
        </ChatBoxFooter>
      </Collapse>
    </ChatBoxContainer>
  );
}
