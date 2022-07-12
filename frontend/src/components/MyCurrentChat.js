import { Button, useToast, Text, Stack, Avatar } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./InAppComp/GroupChatModal";

const MyCurrentChat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  console.log(loggedUser)
  console.log(selectedChat)

  //fetch chats from the api/usr/chats
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // console.log(JSON.parse(localStorage.getItem("userInfo")))
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  // console.log(loggedUser);
  console.log(chats);

  return (
    //display chat screen is chat is selected
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "30%", lg: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* Header of chat */}
      <Box
        pb={3}
        px={3} //horizontal pad
        fontSize={{ base: "22px", sm: "20px", md: "25px" }}
        display="flex"
        flexDir="row"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        {/* //Button for group chat */}
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "14px", md: "10px", lg: "14px" }}
            rightIcon={<AddIcon />}
            // size={{base:"md", sm:"sm",md:"md"}}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="blackAlpha.500"
        // bg="green.300"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {/* //map through chats */}
        {chats ? (
          <Stack overflowY="scroll">
            {/*scroolable*/}
            {chats.map((chat) => (
              // console.log(chat),
              // console.log(chat.users[0].friendList),
              <Box
                display={"flex"}
                flexDir="row"
                onClick={() => setSelectedChat(chat)} //selected chat
                cursor="pointer"
                bg={selectedChat === chat ? "blue.500" : "#E8E8E8"} //turn sleectd chat color blue
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Avatar
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={
                    !chat.isGroupChat
                      ? chat.users[0].name === loggedUser.name
                        ? chat.users[1].name
                        : chat.users[0].name
                      : chat.chatName
                  }
                  src={
                    !chat.isGroupChat
                      ? chat.users[0].pic === loggedUser.pic
                        ? chat.users[1].pic !==
                          `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`
                          ? chat.users[1].pic
                          : chat.users[1].name
                        : chat.users[0].pic !==
                          `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`
                        ? chat.users[0].pic
                        : chat.users[0].name
                      : chat.chatName
                  }
                />
                <Text fontSize="18px">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                  {chat.latestMessage && (
                    <Text fontSize="xs" bottom="50px">
                      <b>
                        {chat.latestMessage.sender.name === loggedUser.name
                          ? "Me"
                          : chat.latestMessage.sender.name}
                        {": "}
                      </b>
                      {chat.latestMessage.content.substring(
                        chat.latestMessage.content.length - 3,
                        chat.latestMessage.content.length
                      ) === "mp4" ||
                      chat.latestMessage.content.substring(
                        chat.latestMessage.content.length - 3,
                        chat.latestMessage.content.length
                      ) === "jpg" ||
                      chat.latestMessage.content.substring(
                        chat.latestMessage.content.length - 3,
                        chat.latestMessage.content.length
                      ) === "png" ||
                      chat.latestMessage.content.substring(
                        chat.latestMessage.content.length - 3,
                        chat.latestMessage.content.length
                      ) === "peg" ? (
                        <img
                          src="https://img.icons8.com/material-rounded/24/000000/image.png"
                          alt="Multimedia"
                          height="20px"
                          width="20px"
                          style={{ display: "inline" }}
                        />
                      ) : (
                        chat.latestMessage.content
                      )}
                    </Text>
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyCurrentChat;
