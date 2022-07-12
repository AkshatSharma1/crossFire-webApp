const express = require("express");
const {protect} = require("../middlewares/authMiddleware");

const router = express.Router();

const { sendMessage, allMessages } = require("../controllers/messageController")

//send message api
router.route("/").post(protect, sendMessage);

//fech all message in partiular chat
router.route("/:chatId").get(protect, allMessages);

module.exports = router;