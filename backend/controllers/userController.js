const { json } = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");


const registerUser = asyncHandler(async (req, res)=>{
    //destruct user data
    const {name, email, password, pic} = req.body;
    console.log(req.body)
    if(!name||!email||!password){
        res.status(400);
        throw new Error("All fields are required");
    }

    //checking if the user is already there or not in db
    const ifUserExist = await User.findOne({email});

    if(ifUserExist){
        res.status(401)
        throw new Error("User already exists!! Please try Logging in..")
        // res.redirect("/login")
    }

    //if not, then create a new user
    const user = await User.create({
        name, email, password, pic
    });

    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            isAdmin: user.isAdmin,
            token: generateToken(user._id) //to send token id for encryption
        })
    }
    else{
        res.status(400);
        throw new Error("User Creation Failed")
    }

})

//Login Part
//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    console.log(user)
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email, 
        pic: user.pic,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  });

  //searching user in all users available
  //we will need a unique thing to distinguish (lets bind name with user_id)
  // we will use queries to get the required query to search for (api/user?key=value)
  const allUsers = asyncHandler(async(req, res)=>{
    //first query argument
    const key = req.query.search
    ?{
      //if(here we are searching either inside name or email)
      $or: [
        {name: {$regex: req.query.search, $options: "i"}},
        {email: {$regex: req.query.search, $options: "i"}}
      ],
    }:/*else*/{};

    //2nd find is done to exclude user which is currently logged in
    //2nd param will work only when the user logged in authorsed(so use Authmiddleware)
    const users = await User.find(key).find({ _id: { $ne: req.user._id } });
    console.log(users)
    // console.log(req.user._id)
    // const friend = await User.find({friendList:{$elemMatch:{_id: req.user._id}}});

    res.send(users);
   })
  

module.exports = {registerUser, authUser, allUsers};