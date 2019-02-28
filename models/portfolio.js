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
    const aboutRef = db.ref("/about");
    aboutRef.once("value", (snapshot) => {
        cb(snapshot.val());
    });
  },

  projects(cb) {
    const projectsRef = db.ref("/projects");
    projectsRef.on("child_added", (snapshot, prevChildKey) => {
      const projects = snapshot.val();
      cb(snapshot.val());
    });
  }
}

// Export for the controller
module.exports = portfolio;