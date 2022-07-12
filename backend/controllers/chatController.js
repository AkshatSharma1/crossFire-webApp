const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel")

//async handler to serve all errors

//access one-to-one chat
const accessChat = asyncHandler(async(req, res)=>{
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
  
    var isChat = await Chat.find({
      isGroupChat: false, //in single chat it should be false
      //here we need to find both ids,ie. curr user and userid one so use and op 
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    //if user is found then populate the users array(userSchema  )
      .populate("users", "-password")
      .populate("latestMessage");
  
      //populate senders mssg(from messageModel)
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
  
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
});

//fetch all chats of a user logged in
const fetchChats = asyncHandler(async(req,res)=>{
  //here we have to check which user is logged in and we have to query for all chats of that user
  try{
    //we will serach in all chats in database(chatModel) and return those which current user is part of
    Chat.find({users:{$elemMatch:{$eq: req.user._id}}})
    .populate("users", "-password")
    .populate("groupAdmin","-password")
    .populate("latestMessage")
    .sort({updateAt: -1})
    .then(async (output)=>{
      output = await User.populate(output,{
        path: "latestMessage.sender",
        select: "name pic email"
      })

      res.status(200).send(output)
    })
  }
  catch(error){
    res.status(400);
    throw new Error(error.message)
  }
})

//create a group chat
const createGroup = asyncHandler(async(req, res)=>{
  //we will add users from the users array and will make a group chat name

  //validation(all fields needed)
  if(!req.body.users || !req.body.name){
    return res.status(400).send({message:"Please fill all the fields"})
  }

  //now will parse the users array sent from the frontend in the stringfied format
  let users = JSON.parse(req.body.users);

  //now as we know a group chat is of more than 2 users( so if users arr length is <2 error)
  if(users.length < 2){
    return res.status(200).send({message: "More than 2 users are required to create a group chat"})
  }

  users.push(req.user); //if length>2 push all the users + curr user

  try{
    const groupChat = await Chat.create({
      chatName: req.body.name, //name from frontend we pass
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    });

    //fetch the group chat and send back to user(to fromtend)
    const fetchGroupChat =  await Chat.findOne({_id: groupChat._id})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    res.status(200).json(fetchGroupChat);
  } catch(error){
    res.status(400);
    throw new Error(error.message);
  }
});

//rename Group
const renameGroup = asyncHandler(async(req,res)=>{
  //we wll fecth the groupChat id and name and will change the name
  const {chatId, chatName} = req.body; //get theese both from the 

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,{
      chatName,
    },{
      new: true,
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if(!updatedChat)
  {
    res.status(400);
    throw new Error("Chat Not Found");
  }
  //else
  res.json(updatedChat);


})

//add user to Group
const addToGroup = asyncHandler(async(req, res)=>{

  //to add user to particular group, we need group chat id and user id
  const {chatId, userId} = req.body;

  //now find the chat using chatid and populate the new users in the users array of group chat with groupchat true
  const addUser = await Chat.findByIdAndUpdate(
    chatId,{
      $push: {users: userId},
    },
    {
      new: true, //shows updation done
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  //check for erros
  if(!addUser){
    res.status(400);
    throw new Error("Chat Not Found");
  }
  //else
  res.json(addUser);

})

//remove user from group
const removeFromGroup = asyncHandler(async(req, res)=>{

  //to add user to particular group, we need group chat id and user id
  const {chatId, userId} = req.body;

  //now find the chat using chatid and populate the new users in the users array of group chat with groupchat true
  const removeUser = await Chat.findByIdAndUpdate(
    chatId,{
      $pull: {users: userId}, //pull the user
    },
    {
      new: true, //shows updation done
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  //check for erros
  if(!removeUser){
    res.status(400);
    throw new Error("Chat Not Found");
  }
  //else
  res.json(removeUser);

})

module.exports = {accessChat, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup};