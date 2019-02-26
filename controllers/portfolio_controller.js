const express = require("express");

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
            portfolio : data
        };
        console.log(hbsObj);
        res.render("index", hbsObj);
    });
});

// router.get("/home", (req, res) => {
//     res.render("index", homePage)
// });

router.post("/admin", (req, res) => {
    // Administration Back End

});

router.use((req, res) => {
    // Fail
    res.sendFile(path.join(__dirname , "../public" , "404.html"))
});

// Export Routes for server.js

module.exports = router; 