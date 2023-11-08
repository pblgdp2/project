import { useEffect, useState } from "react";
import fb from "../../utils/firebase";
import useAppContext from "../../hooks/useAppContextHook";
import styled from "styled-components";
import ChatUsers from "./ChatUsers";
import ChatBox from "./ChatBox";

const { app, firebase } = fb;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 0px;
  right: 0px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatBoxList, setChatBoxList] = useState([]);
  const [users, setUsers] = useState([]);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  const {
    appState: {
      user: { username },
    },
  } = useAppContext();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setFirebaseLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (firebaseLoaded) {
      if (username) {
        app
          .collection("users")
          .where("username", "==", username)
          .onSnapshot((snapshot) => {
            try {
              setUsers((snapshot.docs || []).map((doc) => doc.data()));
            } catch (error) {}
          });
        return () => {
          app.collection(`users`).onSnapshot(() => {
            setUsers([]);
          });
        };
      }
    }
  }, [firebaseLoaded]);

  const handleSendMessage = async (data) => {
    try {
      const msgRef = app.collection("chats");
      await msgRef.add({
        username,
        recipient: data.recipient,
        timestamp: new Date().getTime(),
        value: data?.value,
      });
      const userRef = app.collection("users");
      const userData = await userRef.where("username", "==", data?.recipient).where("recipient", "==", username).get();
      userData.forEach((doc) => {
        userRef.doc(doc.id).update({
          unread: true,
        });
        return;
      });
      const userDataRecipient = await userRef.where("username", "==", username).where("recipient", "==", data?.recipient).get();
      userDataRecipient.forEach((doc) => {
        userRef.doc(doc.id).update({
          unread: false,
        });
        return;
      });
    } catch (error) {}
  };

  const handleStartChat = async (e) => {
    try {
      const userRef = app.collection("users");
      await userRef.doc().set({
        username,
        recipient: e,
        unread: false,
      });
      await userRef.doc().set({
        username: e,
        recipient: username,
        unread: false,
      });
      setChatBoxList((prevState) => {
        prevState.push({ username, recipient: e, unread: false });
        return [...prevState];
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserChatClick = async (data) => {
    try {
      const userRef = app.collection("users");
      const userData = await userRef.where("username", "==", username).where("recipient", "==", data?.recipient).get();
      userData.forEach((doc) => {
        userRef.doc(doc.id).update({
          unread: false,
        });
        return;
      });
      setChatBoxList((prevState) => {
        const chatDataList = prevState.filter((item) => item?.recipient !== data?.recipient);
        chatDataList.push(data);
        return [...chatDataList];
      });
    } catch (error) {}
  };

  const handleRemoveChat = (data) => {
    setChatBoxList((prevState) => {
      const chatDataList = prevState.filter((item) => item?.recipient !== data?.recipient);
      return [...chatDataList];
    });
  };

  return (
    <ChatContainer>
      {chatBoxList.map((item, index) => (
        <ChatBox key={index} data={item} chatData={[]} onSendMessage={handleSendMessage} onChatRemove={handleRemoveChat} />
      ))}
      <ChatUsers users={users} onStartChat={handleStartChat} onClickUser={handleUserChatClick} />
    </ChatContainer>
  );
}
