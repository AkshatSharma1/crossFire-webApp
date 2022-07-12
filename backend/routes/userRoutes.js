const express = require('express');
const {registerUser, authUser, allUsers} = require('../controllers/userController'); 
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware")



//creating userSearch API (after route go to userController to add all users search functionality)
//before checking for all users it will go through middleware protect
router.route("/").get(protect, allUsers); //can also append .get to line 7

//on routing to this page, get ready to accept data from user 

router.route("/").post(registerUser)//.get(protect, allUsers);
router.post("/login", authUser)


module.exports = router;