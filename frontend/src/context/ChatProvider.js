import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children})=>{
    //usestate
    const [user, setUser] = useState();
    const[selectedChat, setSelectedChat] = useState();
    const[chats, setChats] = useState();
    const [notification, setNotification] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        //now set the userINfo
        setUser(userInfo);
         
        // now check if user was present in local storage or not. if yes then route to chat page 
        // if not, navigate to login page
        if(!userInfo){
            navigate("/");
        }
    }, [navigate]);

    console.log(user)

    return (<ChatContext.Provider value={{user, setUser, chats, setChats, selectedChat, setSelectedChat, notification, setNotification}}>
        {children}
    </ChatContext.Provider>);

};

export const ChatState = ()=>{
    return useContext(ChatContext);
}

export default ChatProvider;

//whatever state is made in this, itc acts like global variable, available to all
//useContext is used to access it in all app