const express = require("express");
const router = express();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const { db } = require("../models/user");
const Driver = require("../models/driver");
const Admin = require("../models/admin");
const Complaints = require("../models/complaints");

//User Register
router.post("/user_register", async (req, res) => {
  const { name, email, phone, city, password, cpassword } = req.body;
  if (!name || !email || !phone || !city || !password || !cpassword) {
    res.status(401).json({ errorMessage: "Please Enter All Data" });
  } else if (password !== cpassword) {
    res.status(402).json({ errorMessage: "Password Should Be Same" });
  } else {
    try {
      const userExist = await User.findOne({ email: email });

      if (userExist) {
        return res.status(422).json({ error: "Email Already Exist" });
      } else if (password != cpassword) {
        return res.status(423).json({ error: "Password are not matched" });
      } else {
        const userId = Date.now();
        const user = new User({
          userId,
          name,
          email,
          phone,
          city,
          password,
          cpassword,
        });
        const userRegister = await user.save();
        if (userRegister) {
          res.status(240).json({ message: "User Registered" });
        } else {
          res.status(400).join({ errorMessage: "Registration Failed" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
});

//User Login
router.post("/user_login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ errorMessage: "Please Enter Details" });
    } else {
      const userLogin = await User.findOne({ email: email });
      if (!userLogin) {
        res.status(401).json({ errorMessage: "Account Not Exist" });
      } else {
        const userId = userLogin.userId;
        const name = userLogin.name;
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          res.status(403).json({ errorMessage: "Enter Correct Details" });
        } else {
          const token = await userLogin.generateAuthToken();
          if (token) {
            res.cookie("usertoken", token, {
              expires: new Date(Date.now() + 50000),
              httpOnly: false,
            });
            res.cookie("name", name, {
              expires: new Date(Date.now() + 50000),
              httpOnly: false,
            });
            res.cookie("userId", userId, {
              expires: new Date(Date.now() + 50000),
              httpOnly: false,
            });
            res.status(201).json({ message: "Login Successfull" });
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});


//Driver Register
router.post("/driver_register", async (req, res) => {
  const { name, email, phone, city, password, cpassword, licenseid } = req.body;
  if (!name || !email || !phone || !city || !password || !cpassword || !licenseid) {
    res.status(401).json({ errorMessage: "Please Enter All Data" });
  } else if (password !== cpassword) {
    res.status(402).json({ errorMessage: "Password Should Be Same" });
  } else {
    try {
      const driverExist = await Driver.findOne({ email: email });

      if (driverExist) {
        return res.status(422).json({ error: "Email Already Exist" });
      } else if (password != cpassword) {
        return res.status(423).json({ error: "Password are not matched" });
      } else {
        const driverId = Date.now();
        const driver = new Driver({
          driverId,
          name,
          email,
          phone,
          city,
          password,
          cpassword,
          licenseid,
        });
        const driverRegister = await driver.save();
        if (driverRegister) {
          res.status(240).json({ message: "Driver Registered" });
        } else {
          res.status(400).join({ errorMessage: "Registration Failed" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
});

//Driver Login
router.post("/driver_login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ errorMessage: "Please Enter Details" });
    } else {
      const driverLogin = await Driver.findOne({ email: email });
      if (!driverLogin) {
        res.status(401).json({ errorMessage: "Account Not Exist" });
      } else {
        const driverId = driverLogin.driverId;
        const name = driverLogin.name;
        const isMatch = await bcrypt.compare(password, driverLogin.password);
        if (!isMatch) {
          res.status(403).json({ errorMessage: "Enter Correct Details" });
        } else {
          const token = await driverLogin.generateAuthToken();
          if (token) {
            res.cookie("drivertoken", token, {
              expires: new Date(Date.now() + 50000),
              httpOnly: false,
            });
            res.cookie("name", name, {
              expires: new Date(Date.now() + 50000),
              httpOnly: false,
            });
            res.cookie("driverId", driverId, {
              expires: new Date(Date.now() + 50000),
              httpOnly: false,
            });
            res.status(201).json({ message: "Login Successfull" });
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});



//Admin Register
router.post("/admin_register", async (req, res) => {
  const {email, password, cpassword} = req.body;
  if (!email || !password || !cpassword ) {
    res.status(401).json({ errorMessage: "Please Enter All Data" });
  } else if (password !== cpassword) {
    res.status(402).json({ errorMessage: "Password Should Be Same" });
  } else {
    try {
      const adminExist = await Admin.findOne({ email: email });

      if (adminExist) {
        return res.status(422).json({ error: "Email Already Exist" });
      } else if (password != cpassword) {
        return res.status(423).json({ error: "Password are not matched" });
      } else {
        const adminId = Date.now();
        const admin = new Admin({
          adminId,
          email,
          password,
          cpassword,
        });
        const adminRegister = await admin.save();
        if (adminRegister) {
          res.status(240).json({ message: "Admin Registered" });
        } else {
          res.status(400).join({ errorMessage: "Registration Failed" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
});

//Admin Login
router.post("/admin_login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ errorMessage: "Please Enter Details" });
    } else {
      const adminLogin = await Admin.findOne({ email: email });
      if (!adminLogin) {
        res.status(401).json({ errorMessage: "Account Not Exist" });
      } else {
        const isMatch = await bcrypt.compare(password, adminLogin.password);
        if (!isMatch) {
          res.status(403).json({ errorMessage: "Enter Correct Details" });
        } else {
          const adminId = adminLogin.adminId;
          // const name = adminLogin.name;/
          const token = await adminLogin.generateAuthToken();
          if (token) {
            res.cookie("admintoken", token, {
              expires: new Date(Date.now() + 50000),
              httpOnly: false,
            });
            // res.cookie("name", name, {
            //   expires: new Date(Date.now() + 50000),
            //   httpOnly: false,
            // });
            res.cookie("adminId", adminId, {
              expires: new Date(Date.now() + 50000),
              httpOnly: false,
            });
            res.status(201).json({ message: "Login Successfull" });
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});


//User Complaints
router.post("/user_complaints", async (req, res) => {
  const {userId, username, phone, area, locality, date, landmark, note} = req.body;
  if (!userId || !username || !phone || !area || !locality || !date || !landmark || !note ) {
    res.status(401).json({ errorMessage: "Please Enter All Data" });
  }else {
    try {
        const complaintId = Date.now();
        const complaint = new Complaints({
          complaintId,
          userId,
          username,
          phone,
          area,
          locality,
          date,
          landmark,
          note,
        });
        const userComplaint = await complaint.save();
        if (userComplaint) {
          res.status(240).json({ message: "Complaint Sent" });
        } else {
          res.status(400).join({ errorMessage: "Complaint sent Failed" });
        }
      
    } catch (err) {
      console.log(err);
    }
  }
});


// router.get("/contact", async (req, res) => {
//   const data = await User.find({});
//   try {
//     res.status(200).json({
//       status: "Success",
//       data: {
//         data,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "Failed",
//       message: err,
//     });
//   }
// });

// router.get("/about", authenticate, (req, res) => {
//   return req.rootUser;
// });

// router.get("/getdata", authenticate, (req, res) => { 
//   return req.rootUser;
// });



router.get("/logout", (req, res) => {
  res.clearCookie("usertoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
