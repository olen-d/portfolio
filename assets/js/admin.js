let aboutBtn = document.getElementById("aboutBtn");
let projectsBtn = document.getElementById("projectsBtn");
let skillsBtn = document.getElementById("skillsBtn");
let themesBtn = document.getElementById("themesBtn");
let dbUpdatedOkBtn = document.getElementById("db-updated-ok");

let currentGroup = "none";

const aboutData = new Object();
const projectData = new Object();

const admin = {
    showGroup(group) {
        if(currentGroup != "none") 
            {
                admin.hideGroup(currentGroup);
            }
        document.getElementById(group).style.display = "block";
        currentGroup = group;
    },

    hideGroup(group) {
        document.getElementById(group).style.display = "none";
        currentGroup = "none";
    }
}

const data = {
    retrieveAbout() {
        let ref = db.ref(`/about/${userId}`)
        
        ref.once("value", (snapshot) => {
            let sv = snapshot.val();

            if(sv !== null) {
                aboutItems.forEach((item) => {
                    document.getElementById(item).value = sv[item];
                });
            }
        // Handle any errors
        }, (errorObject) => {
            console.log("Errors handled: " + errorObject.code);
        });        
    },
    
    updateAbout() {
        // Update the Database
        if(validate.aboutForm()) {
            let ref = db.ref(`/about/${userId}`)

            aboutItems.forEach((key) => {
                value = document.getElementById(key).value.trim();
                aboutData[key] = value;
            });

            aboutData["dateUpdated"] = firebase.database.ServerValue.TIMESTAMP;

            ref.set(aboutData, (error) => {
                (error ? console.log("Errors handled " + error) : console.log("About me successfuly updated in the database. "));
            });

            // Clean up
            du = document.getElementById("db-updated");
            du.showModal();
            document.getElementById("aboutForm").reset();
            dbUpdatedOkBtn.addEventListener("click", () => { 
                du.close(); 
                admin.hideGroup("about");
            });
        }
    },

    retrieveProjects() {
        let tb = document.getElementById("projects-table");
        let ref = db.ref(`/projects/${userId}`)
        
        // ref.once("value", (snapshot) => {
        //     let sv = snapshot.val();

        //     if(sv !== null) {
        //         projectItems.forEach((item) => {
        //             tb.appendChild(`<tr></tr>`);
        //            //append to table
        //         });
        //     }
        // // Handle any errors
        // }, (errorObject) => {
        //     console.log("Errors handled: " + errorObject.code);
        // });        
        ref.orderByChild("projectTitle").on("child_added", (snapshot) => {

            let sv = snapshot.val();
            let sk = snapshot.ref.key;
            
            let newRow = `<tr id=\"${sk}\"><th scope=\"row\" class=\"projectTitle\" >${sv.projectTitle}</th><td><a href=\"#edit-train\"><i class=\"fas fa-edit edit\" data-id=\"${sk}\"></i></a></td><td><i class=\"fas fa-times delete\" data-id=\"${sk}\" ></i></td></tr>`;
            tb.appendChild(newRow);
            console.log("--- ",newRow);
            //$("#trains").append(newRow);

            //  Event listener to delete train
            // $(`#${sk} .delete`).on("click", function () {
            //     trainSchedules.deleteTrain(this);
            // });

            // Event listener to edit train
            // $(`#${sk} .edit`).on("click", function () {
            //     trainSchedules.editTrain(this);
            // });
            
            // Store train keys for the updates
            // trains.push(sk);
            
            // Handle the errors
          }, (errorObject) => {
            console.log("Errors handled: " + errorObject.code);
          });
    },

    addProject() {
        if(validate.projectForm()) {
            let ref = db.ref(`/projects/${userId}`)

            projectItems.forEach((key) => {
                value = document.getElementById(key).value.trim();
                projectData[key] = value;
            })

            
            // Handle errors 
            ref.push(projectData, (error) => {
                (error ? console.log("Errors handled " + error) : console.log("Project successfully added to the database. "));
            });

            // Clean up
            document.getElementById("projectForm").reset();
        }
    },

    editProject() {

    },

    updateProject() {

    }
}

const validate = {
    aboutForm() {
        return true;
        // TODO:    Set this up to actually validate the form in a robust manner in the future
        //          Currently using built-in HTML 5 validation, which is very okay
    },

    projectForm() {
        return true;
        // TODO:    Set this up to actually validate the form in a robust manner in the future
        //          Currently using built-in HTML 5 validation, which is very okay
    }
}

// Event Listeners
loginBtn.addEventListener("click", () => { auth.login(); });
logoutBtn.addEventListener("click", () => { auth.logout(); });

aboutBtn.addEventListener("click", () => { 
    admin.showGroup("about"); 
    data.retrieveAbout();
});

aboutSubmit.addEventListener("click", (e) => {
    e.preventDefault(); 
    data.updateAbout(); 
});

projectsBtn.addEventListener("click", () => { 
    admin.showGroup("projects"); 
    data.retrieveProjects();
});

projectAdd.addEventListener("click", (e) => {
    e.preventDefault(); 
    data.addProject(); 
});