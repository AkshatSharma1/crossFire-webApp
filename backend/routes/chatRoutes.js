const express = require('express');
const {protect} = require("../middlewares/authMiddleware")
const router = express.Router();
const {accessChat, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chatController")

//Chat options availble(features)

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroup);
router.route("/rename").put(protect, renameGroup);
router.route("/addgroup").put(protect, addToGroup);
router.route("/removegroup").put(protect, removeFromGroup);


module.exports = router;