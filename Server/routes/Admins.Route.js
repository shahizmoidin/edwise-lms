const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");

//model import
const { AdminModel } = require("../models/admin.model");

//middleware import
const {
  isAdminAuthenticated,
} = require("../middlewares/authenticate");

//get all admin data route
router.get("/all", async (req, res) => {
  try {
    const admins = await AdminModel.find();
    res.send({ message: "All admins data", admins });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

//admin registration route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body.data;
  try {
    let user = await AdminModel.findOne({ email });
    if (user) {
      return res.status(400).send({ msg: "User already registered" });
    }
    const secure_password = await bcrypt.hash(password, +process.env.Salt_rounds);
    const admin = new AdminModel({
      name,
      email,
      password: secure_password,
    });
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "libraryofmycollege@gmail.com",  // Use environment variables for these credentials
        pass: "nsziioprjzwcodlm",  // Use environment variables for these credentials
      },
    });

    const mailOptions = {
      from: "libraryofmycollege@gmail.com",
      to: email,
      subject: "Account ID and Password",
      text: `Welcome to LMS, Congratulations, Your account has been created successfully. This is your User type: Admin and Password: ${password}`,
    };

    await transporter.sendMail(mailOptions);

    res.send({
      msg: "Admin Registered Successfully and password sent to email",
      admin: admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Admin Registration failed" });
  }
});


//admin login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminModel.find({ email });
    if (admin.length > 0) {
      if (admin[0].access == "false") {
        return res.send({ message: "Access Denied" });
      }
      bcrypt.compare(password, admin[0].password, (err, results) => {
        if (results) {
          let token = jwt.sign(
            { email, name: admin[0].name },
            process.env.secret_key,
            { expiresIn: "7d" }
          );
          res.send({
            message: "Login Successful",
            user: admin[0],
            token,
          });
        } else {
          res.status(201).send({ message: "Wrong credentials" });
        }
      });
    } else {
      res.send({ message: "Wrong credentials" });
    }
  } catch (error) {
    res.status(404).send({ message: "Error" });
  }
});

//edit admin route
router.patch("/:adminId", isAdminAuthenticated, async (req, res) => {
  const { adminId } = req.params;
  const payload = req.body.data;
  try {
    const admin = await AdminModel.findByIdAndUpdate({ _id: adminId }, payload);
    const updatedAdmin = await AdminModel.find({ _id: adminId });
    res.status(200).send({ msg: "Updated Admin", admin: updatedAdmin[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete admin route
router.delete("/:adminId", async (req, res) => {
  const { adminId } = req.params;
  try {
    const admin = await AdminModel.findByIdAndDelete({ _id: adminId });
    res.status(200).send({ msg: "Deleted Admin" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
