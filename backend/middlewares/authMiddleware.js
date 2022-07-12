const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

//name of middleware. it is wrapped inside async handler so that we can check for all errors

const protect = asyncHandler(async (req, res, next) => {
  let token; //here Bearer

  //token is send in a header of a url
  if (
    //if header has token or not
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
        //extracting
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
