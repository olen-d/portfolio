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
            du = document.getElementById("db-updated"); console.log(du);
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
        
        ref.orderByChild("projectTitle").on("child_added", (snapshot) => {

            let sv = snapshot.val();
            let sk = snapshot.ref.key;
            
            let newRow = `<tr id=\"${sk}\" class="project-row"><th scope=\"row\" class=\"project\" >${sv.projectTitle}</th><td><i class=\"fas fa-edit edit\" data-id=\"${sk}\"></i></td><td><i class=\"fas fa-times delete\" data-id=\"${sk}\" ></i></td></tr>`;
            tb.insertAdjacentHTML("beforeend",newRow);
            
            //  Event listeners to edit or delete project
            document.querySelector("#projects-table").addEventListener("click", function(event) {
                if(event.target.classList.contains("edit")) {
                    data.editProject(event.target.dataset.id);
                } else if (event.target.classList.contains("delete")) {
                    data.deleteProject(event.target.dataset.id);
                }
            });

            // Handle the errors
          }, (errorObject) => {
            console.log("Errors handled: " + errorObject.code);
        });
    },

    retrieveProject(projId) {
        let ref = db.ref(`/projects/${userId}/${projId}`)

        ref.once("value", (snapshot) => {
            let sv = snapshot.val();

            if(sv !== null) {
                projectItems.forEach((item) => { console.log("-- ",item)
                    document.getElementById(item).value = sv[item];
                });
            }
        // Handle any errors
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

    editProject(projId) {
        document.getElementById("project-form-h").innerText = "Edit Project";
        data.retrieveProject(projId);
    },

    updateProject() {

    },

    deleteProject(projId) {
        // alert("delete" + projId);
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