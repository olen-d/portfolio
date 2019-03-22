// Import the database connection
const db = require("../config/connection");

const portfolio = {
  all(cb) {
    portfolio.about((aData) => {
      let aboutObj = {about : aData};
      portfolio.projects((pData) => {
        let projObj = {projects : pData};
        cb({...aboutObj, ...projObj});
      });
    });
  },

  about(cb) {
    //console.log(db.about.find({userName: "olen.d"}));
    db.about.find({userName: "olen.d"}, (err, data) => {
      if(err) {
        throw err;
      } else {
        cb(data);
      }
    });
  },

  projects(cb) {
    db.projects.find({show: 1}, (err, data) => {
      if (err) {
        throw err;
      } else {
        cb(data);
      }
    });
  }
}

// Export for the controller
module.exports = portfolio;