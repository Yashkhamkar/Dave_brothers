const twilio = require("twilio");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const accountSid = "ACea22e53210838d312cb142ee66063730";
const authToken = "feca57c8e24759541afa771457452209";
const client = require("twilio")(accountSid, authToken);
const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const mongoose = require("mongoose");
const registerUser = async (req, res) => {
  const userExists = await User.findOne({ phone: req.body.phone });
  if (userExists) {
    return res.status(401).json(0);
  }
  const hashedPassword = await bcrypt.hash(req.body.pass, 10);
  const newUser = await User.create({
    ...req.body,
    pass: hashedPassword,
  });
  const { pass, ...others } = newUser._doc;
  const token = jwt.sign(
    { id: newUser._id, isAdmin: newUser.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "5h",
    }
  );
  return res.status(200).json({ others, token });
};
const SentOtp = async (req, res) => {
  const userExists = await User.findOne({ phone: req.body.phone }).catch(
    (error) => {
      console.error(error);
    }
  );
  // console.log(userExists);
  if (!userExists) {
    return res.status(401).json({ message: "OTP " });
  }
  const comparePass = await bcrypt.compare(req.body.password, userExists.pass);
  if (!comparePass) {
    return res.status(401).json(0);
  }
  const random = Math.floor(Math.random() * 9000) + 10000;
  client.messages
    .create({
      body: random,
      from: "+12708195787",
      to: `+91${req.body.phone}`,
    })
    .then(() => {
      const saveOtpData = new Otp({
        otp: random,
      });
      saveOtpData.save();
      res.status(200).json({ message: "OTP sent" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to send OTP" });
    });
};
const verifyOtp = async (req, res) => {
  const otpExists = await Otp.findOne({ otp: req.body.otp });
  console.log(otpExists);
  if (otpExists) {
    // Otp.findOneAndDelete({ otp: otp });
    res.status(200).send("OTP verified");
  } else {
    res.status(400).send("Invalid OTP");
  }
};
module.exports = { SentOtp, verifyOtp, registerUser };
