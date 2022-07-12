//The schema will have data like
//chatname
//isGroupChat or not
//users avaialble
//latest message
//groupAdmin incase of grouo chat

const mongoose = require('mongoose')

//defining schema
const chatModel = mongoose.Schema(
    {
        chatName: {type: String, trim: true},
        isGroupChat: {type: Boolean, default: false},
        //users arrray to store all users(it is used to match chats of a particular user he is part of)
        users: [
            {
                //id to particular user
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", //refernce to user model
            },
        ],
        latestMessage:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },

        groupAdmin:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
)

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;