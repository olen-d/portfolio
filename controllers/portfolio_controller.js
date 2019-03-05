require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const portfolio = require("./../models/portfolio");

// router.get("/", function(req, res) {
//     cat.all(function(data) {
//       var hbsObject = {
//         cats: data
//       };
//       console.log(hbsObject);
//       res.render("index", hbsObject);
//     });
//   });


    
// const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
    portfolio.all((data) => {
        let hbsObj = {
            all : data
        };
        //console.log(hbsObj);
        res.render("index", hbsObj);
    });
});

// router.get("/home", (req, res) => {
//     res.render("index", homePage)
// });

router.post("/admin", (req, res) => {
    // Administration Back End

});

// Contact Form
router.post("/api/contact/send", (req, res) => {
    //console.log("-----",req.body.data.name, req.body.data.email, req.body.data.message);
    let name = req.body.data.name;
    let email = req.body.data.email;
    let message = req.body.data.message;

//Set up the mailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS
    }
});

let mailOptions = {
    from: `${email}`,
    to: "contact@olen.dev",
    subject: `[OLEN.DEV] Website Contact Form Message From ${name}`,
    text: `${message} \n\n Contact Name: ${name} \nContact Email: ${email}`
}

transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
        console.log("An error sending the email ocurred.", err);
    } else {
        res.json(success);
    }
    });
});


router.use((req, res) => {
    // Fail
    res.sendFile(path.join(__dirname , "../public" , "404.html"))
});

// Export Routes for server.js

module.exports = router; 