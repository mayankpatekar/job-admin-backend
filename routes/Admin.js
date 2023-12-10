const express = require('express');
const { Admin } = require("../models/models.js");

const router = express.Router();

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).send({ message: "success", token });
};

let protect = async (req, res, next) => {
    let token = undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Admin")
    ) {
        console.log(req.headers.authorization);
        let tokenId = req.headers.authorization.split(" ");
        // console.log(token);
        // console.log(tokenId)
        token = tokenId[1];
    }

    if (!token) {
        return next(res.status(401).send({ message: "unauthorized access" }));
    }

    try {
        const decoded = jwt.verify(token, "abc");
        const user = await Admin.findById(decoded.id);
        if (!user) {
            return next(res.status(404).send({ message: "user Not Found" }));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(res.status(401).send({ message: "not authorized" }));
    }
};



router.post('/register', async (req, res) => {
    const { email, pass } = req.body;
    console.log(email, pass);
    try {
        const user = await Admin.find({ email: email });
        console.log(user);

        if (user.length > 0) {
            res.json({ message: "User already exists..." });
        } else {
            const newUser = new Admin({
                email: email,
                pass: pass
            });

            // To save data to the database with error handling
            try {
                await newUser.save();
                sendToken(newUser, 201, res);
            } catch (err) {
                res.send(err);
            }
        }
    } catch (err) {
        console.log(err);
    }
});


router.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await Admin.findOne({ email: email }).select("+pass");
        // console.log(user)
        if (user) {
            const isMatch = await user.matchPasswords(pass);
            // console.log(isMatch)
            if (isMatch) {
                sendToken(user, 200, res);
            } else {
                res.status(401).send({ message: "invalid password" });
            }
        } else {
            res.status(401).send({ message: "Invalid Username" });
        }
    } catch (err) {
        console.log(err);
    }

})
// router.post("/forgotpassword", async (req, res, next) => {
//     const { Email } = req.body;
  
//     try {
//       const user = await Admin.findOne({ email: Email });
//       if (!user) {
//         console.log(Email);
//         return next(res.status(404).send({ message: "Email could not be send" }));
//       }
//       const resetToken = user.getResetPasswordToken();
//       await user.save();
//       const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
//       const message = `<h1>Reset Password link</h1><p>click on the link to reset password</p><a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;
  
//       console.log(resetUrl);
//       try {
//         await sendEmail({
//           to: user.email,
//           subject: "Password Reset Request",
//           text: message,
//         });
//         res.status(200).send({ message: "Email Sent" });
//       } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;
//         await user.save();
//         return next(res.status(500).send({ message: "Email could not be send" }));
//       }
//     } catch (err) {
//       next(err);
//     }
//   });




router.post('/get/applications', async (req, res) => {

})


module.exports = router