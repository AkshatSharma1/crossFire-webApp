import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideBar from '../components/InAppComp/SideBar';
import MyCurrentChat from '../components/MyCurrentChat';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {

  const [fetchAgain, setFetchAgain] = useState(false);
  const {user} = ChatState();


  return (
    <div style={{width:"100%"}}>
      {/* is user is present load Sidebar search  */}
      {user && <SideBar />}

      {/* chatted users box */}
      <Box
       display="flex"
       justifyContent="space-between"
       w="100%"
       h="91.5vh"
       p="10px"
      >
        {user && <MyCurrentChat fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage;