const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

// get the use by id 

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);



module.exports = router;
