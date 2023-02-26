const express = require("express");
const {
  SentOtp,
  verifyOtp,
  registerUser,
} = require("../controllers/userController");
const router = express.Router();

router.post("/login", SentOtp);
router.post("/register", registerUser);
router.post("/verify", verifyOtp);
module.exports = router;
