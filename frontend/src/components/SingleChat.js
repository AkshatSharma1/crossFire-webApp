// import {
//   Text,
//   Box,
//   IconButton,
//   Spinner,
//   Center,
//   FormControl,
//   Input,
//   useToast,
//   InputGroup,
// } from "@chakra-ui/react";
// import "./styles.css";
// import { useState, useEffect } from "react";
// import { ArrowBackIcon, ArrowRightIcon } from "@chakra-ui/icons";
// import React from "react";
// import { ChatState } from "../context/ChatProvider";
// import { getSender, getSenderFull } from "../config/ChatLogics";
// import ProfileModal from "./InAppComp/ProfileModal";
// import UpdateGroupModal from "./InAppComp/UpdateGroupModal";
// import axios from "axios";
// import ScrollableChat from "./ScrollableChat";

// //socket.io
// import io from "socket.io-client";

// //socket endpoint
// const ENDPOINT = "http://localhost:5000";

// var socket, selectedChatCompare;

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//   //states for rendereing messages
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newMessage, setNewMessage] = useState('');
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);

//   const { user, selectedChat, setSelectedChat } = ChatState();
//   const toast = useToast();

//   //fetch messages
//   const fetchMessages = async () => {
//     if (!selectedChat) return; //if no chat selected

//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       setLoading(true);

//       const { data } = await axios.get(
//         `/api/message/${selectedChat._id}`,
//         config
//       );

//       setMessages(data);
//       setLoading(false);

//       socket.emit("join chat", selectedChat._id);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the Messages",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
//   };

//   //sendMessage on enter
//   const sendMessage = async (e) => {
//     socket.emit("stop typing", selectedChat._id)
//     if ((e.key==="Enter" && newMessage )|| (e.type==="click" && newMessage)) {
//       try {
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//         };

//         setNewMessage(""); //set message empty befor the next api call
//         console.log(messages)
//         const { data } = await axios.post(
//           "/api/message",
//           {
//             content: newMessage,
//             chatId: selectedChat,
//           },
//           config
//         );
//         console.log(data);

//         //send mssg
//         socket.emit("new message", data);
//         console.log(data);

//         setMessages([...messages, data]); //append new messages to all messges
//       } catch (error) {
//         toast({
//           title: "Error Occured!",
//           description: "Failed to send the Message",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//           position: "bottom",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     socket = io(ENDPOINT);
//     socket.emit("setup", user);
//     socket.on("connected", () => setSocketConnected(true));
//     socket.on("typing",()=>setIsTyping(true));
//     socket.on("stop typing", ()=>setIsTyping(false));

//   }, []);

//   //Call fetch chats fn
//   useEffect(() => {
//     fetchMessages();
//     //to keep backup of selected chat (to keep note whether to give notifiction for new mssg or emit it)
//     selectedChatCompare = selectedChat;
//     // eslint-disable-next-line
//   }, [selectedChat]);

//   useEffect(() => {
//     socket.on("message received", (newMessageReceived) => {
//       //if we are not in the user who sent message or any chat is not slected, send notification
//       if (
//         !selectedChatCompare ||
//         selectedChatCompare._id !== newMessageReceived.chat._id
//       ) {
//         //give notificati on
//       } else {
//         setMessages([...messages, newMessageReceived]);
//       }
//     });
//   });

//   //typing
//   const typingHandler = (e) => {
//     setNewMessage(e.target.value);

//     //typing indicator
//     if(!socketConnected) return;

//     if(!typing){
//       setTyping(true);
//       socket.emit("typing", selectedChat._id);
//     }

//     //fn to determine when to stop typing indicator

//     //get the last typing time
//     let lastType = new Date().getTime();
//     var timerLength = 3000;

//     setTimeout(()=>{
//       var timeNow = new Date().getTime();
//       var timeDiff = timeNow - lastType;

//       if(timeDiff >= timerLength && typing){
//         socket.emit("stop typing", selectedChat._id);
//         setTyping(false);
//       }
//     }, timerLength)
//   };

//   return (
//     <>
//       {selectedChat ? (
//         <>
//           <Text
//             fontSize={{ base: "28px", md: "30px" }}
//             pb={3}
//             px={2}
//             w="100%"
//             fontFamily="Work sans"
//             display="flex"
//             justifyContent={{ base: "space-between" }}
//             alignItems="center"
//           >
//             <IconButton
//               display={{ base: "flex", md: "none" }}
//               icon={<ArrowBackIcon />}
//               onClick={() => setSelectedChat("")}
//             />
//             {!selectedChat.isGroupChat ? (
//               <>
//                 {/* show receiver pic */}
//                 {getSender(user, selectedChat.users)}
//                 <ProfileModal user={getSenderFull(user, selectedChat.users)} />
//               </>
//             ) : (
//               <>
//                 {selectedChat.chatName.toUpperCase()}
//                 <UpdateGroupModal
//                   fetchMessages={fetchMessages}
//                   fetchAgain={fetchAgain}
//                   setFetchAgain={setFetchAgain}
//                 />
//               </>
//             )}
//           </Text>
//           <Box
//             display="flex"
//             flexDir="column"
//             justifyContent="flex-end"
//             p={3}
//             bg="blackAlpha.500"
//             w="100%"
//             h="100%"
//             borderRadius="lg"
//             overflowY="hidden"
//           >
//             {loading ? (
//               <Center h="100%">
//                 <Spinner
//                   thickness="4px"
//                   speed="0.70s"
//                   emptyColor="gray.200"
//                   color="brown.700"
//                   size="xl"
//                 />
//               </Center>
//             ) : (
//               <div className="messages">
//                 <ScrollableChat messages={messages} />
//                 {/* Messages */}
//               </div>
//             )}

//             <FormControl onKeyDown={sendMessage} isRequired mt={3}>
//               {isTyping ?<div>Loading..</div>:<></>}

//               <InputGroup>
//                 <Input
//                   variant="filled"
//                   bg="#E0E0E0.500"
//                   placeholder="Enter message..."
//                   onChange={typingHandler}
//                   value={newMessage}
//                 />
//                 <IconButton icon={<ArrowRightIcon />} onClick={sendMessage} right="20px"/>
//               </InputGroup>
//             </FormControl>
//           </Box>
//         </>
//       ) : (
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           h="100%"
//         >
//           <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
//             Click on a user to start chatting
//           </Text>
//         </Box>
//       )}
//     </>
//   );
// };

// export default SingleChat;


import { FormControl } from "@chakra-ui/form-control";
import { InputRightElement, InputLeftElement } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import {
  InputGroup,
  IconButton,
  Spinner,
  Button,
  useToast,
  Center,
  Icon,

  Input,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowBackIcon,
  ArrowRightIcon,
  AttachmentIcon,
} from "@chakra-ui/icons";
import ProfileModal from "./InAppComp/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import { BiImageAdd } from "react-icons/bi";
import { MdVideoCall } from "react-icons/md";
import Picker from "emoji-picker-react";
import Dropzone from "react-dropzone";

import io from "socket.io-client";
import UpdateGroupChatModal from "./InAppComp/UpdateGroupModal";
import { ChatState } from "../context/ChatProvider";
// const ENDPOINT = "http://localhost:5000"; 
const ENDPOINT = "https://crossfire-webapp.herokuapp.com/"; //After deployment


var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const navigate = useNavigate();

  const navigateToVideoChat = () =>{
    navigate('/videochat')
  }
  //emoji
  const [showEmoji, setShowEmoji] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();


  console.log(user);
  console.log(selectedChat);

  console.log(user);
  console.log(selectedChat);

  //joinChat

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  //Send Message
  const sendMessage = async (e) => {
    if (newMessage.length !== 0) {
      if (
        (e.key === "Enter" && newMessage) ||
        (e.type === "click" && newMessage)
      ) {
        socket.emit("stop typing", selectedChat._id);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };

          setNewMessage("");
          const { data } = await axios.post(
            "/api/message",
            {
              content: newMessage,
              chatId: selectedChat,
            },
            config
          );

          socket.emit("new message", data);
          setMessages([...messages, data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    } else {
      toast({
        title: "Error Occured!",
        description: "Message cannot be empty",
        status: "error",
        duration: 10,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  //Upload Image
  // const uploadImage = (e) => {
  //   setNewMessage(e.target.files[0].name);
  //   setImage(e.target.files[0]);
  // };

  //drop image
  const onDrop = (files) => {
    console.log(files);

    let formData = new FormData();

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
    };

    formData.append("file", files[0]);
    console.log(formData);

    axios.post("api/chats/uploadfiles", formData, config).then((response) => {
      console.log(response);
      if (response.data.success) {
        console.log(user);
        console.log(response.data.url);
        setNewMessage(response.data.url);
      }
    });
  };

  //drop file
  const onDropFile = (files) => {
    console.log(files);

    let formData = new FormData();

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
    };

    formData.append("file", files[0]);

    axios.post("api/chats/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        console.log(user);
        console.log(response);
        setNewMessage(response.data.url);
      }
    });
  };

  const handleEmojiShow = () => {
    setShowEmoji((v) => !v);
  };

  const handleEmojiSelect = (e, emojiObject) => {
    console.log(e);
    setNewMessage(emojiObject.emoji);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            <>
              <Button
                rightIcon={<MdVideoCall />}
                colorScheme="teal"
                variant="solid"
                onClick={navigateToVideoChat}
              >
                Call
              </Button>
            </>
            {!selectedChat.isGroupChat ? (
              <>
                {/* show receiver pic */}
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="blackAlpha.500"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Center h="100%">
                <Spinner
                  thickness="4px"
                  speed="0.70s"
                  emptyColor="gray.200"
                  color="brown.700"
                  size="xl"
                />
              </Center>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                {/* Messages */}
              </div>
            )}
            <div>
              {showEmoji && (
                <div>
                  <Picker onEmojiClick={handleEmojiSelect} />
                </div>
              )}
            </div>
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {istyping ? (
                <div className="balls">
                  <div className="ball ball1"></div>
                  <div className="ball ball2"></div>
                  <div className="ball ball3"></div>
                </div>
              ) : (
                <></>
              )}

              <InputGroup>
                <InputLeftElement
                  type="file"
                  cursor="pointer"
                  children={
                    <Dropzone onDrop={onDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon as={BiImageAdd} boxSize="1.6em" />
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  }
                  ml={8}
                />
                <InputLeftElement
                  cursor="pointer"
                  children={
                    <Icon
                      as={BsFillEmojiLaughingFill}
                      boxSize="1.3em"
                      onClick={handleEmojiShow}
                    />
                  }
                />
                <InputRightElement
                  cursor="pointer"
                  children={
                    <Dropzone onDrop={onDropFile}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <AttachmentIcon boxSize="1.3em" />
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  }
                  right="40px"
                />
                <InputRightElement
                  cursor="pointer"
                  children={<ArrowRightIcon mr={2} />}
                  onClick={sendMessage}
                />
                <Input
                  paddingLeft="70px"
                  paddingRight="75px"
                  variant="outline"
                  bg="#e8fefb"
                  placeholder="Enter message..."
                  onChange={typingHandler}
                  // value={newMessage}
                  width="100%"
                />
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
