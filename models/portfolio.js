// Import the database connection
const db = require("../config/connection");

const portfolio = {
  all (cb) {
    const aboutRef = db.ref("/about");
    aboutRef.once("value", (snapshot) => {
        cb(snapshot.val());
    });
  }
}

// Export for the controller
module.exports = portfolio;