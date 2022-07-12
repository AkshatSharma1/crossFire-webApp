import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  useToast,
} from "@chakra-ui/react";

import { Spinner } from "@chakra-ui/spinner";

import axios from "axios";
import { IoMdPersonAdd } from "react-icons/io"
import { MDBBadge, MDBIcon } from "mdb-react-ui-kit";
import { React, useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserComponent/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();

  console.log(user)
  //for drawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  //Logout fn
  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  //search users
  const handleSearch = async () => {
    //if no data input
    // if (!search) {
    //   toast({
    //     title: "Please enter details",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "top-left",
    //   });
    //   return;
    // }

    try {
      setLoading(true); //when serach starts, load the data

      //since route is protected, send the authrorization token as headers
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      //destruct the data from query
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false); //data is fecthed, set loading to false
      // setSearchResult(data); //search result is the output data
      // console.log(data)
      console.log(search);
      let new_data = [];

      data.forEach((item) => {
        if (item["name"].includes(search)) {
          // console.log(item)
          new_data.push(item);
        }
      });
      console.log(new_data);
      if (Object.keys(new_data).length === 0) {
        toast({
          title: "No users found!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      } else {
        setSearchResult(new_data);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    //if the data is fecthed , then return it, see last part of code
  };

  //acess chat
  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      //if already chatted with user, append new chats
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      console.log(data)
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  console.log();

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          label="Click to search"
          hasArrow
          bg="yellow.300"
          color="black"
          placement="bottom-start"
        >
          {/* onClick will open drawer */}
          <Button variant="ghost" onClick={onOpen} bg="gray.100">
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search for user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work Sans">
          Cross-Fire
        </Text>

        <div>
          <Menu>
            <MenuButton p={1} position="relative" right="15px" top="5px">
              <MDBIcon fas icon="bell" size="lg"/>
              <MDBBadge color="danger" notification pill>
                {notification.length}  
              </MDBBadge>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notification.filter((n) => n !== notify));
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `New message in ${notify.chat.chatName}`
                    : `New message from ${getSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {/* here name will be shown if no pic */}
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Drwaer component */}
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            {/* Make a box for input */}
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {/* if loading true means data is fecthed */}
            {loading ? (
              // render chatloading component
              <ChatLoading />
            ) : (
              //chaing of results
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {/* //show animation */}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;
