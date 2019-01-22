let aboutBtn = document.getElementById("aboutBtn");
let projectsBtn = document.getElementById("projectsBtn");
let skillsBtn = document.getElementById("skillsBtn");
let themesBtn = document.getElementById("themesBtn");

const aboutData = new Object();

const admin = {
    showGroup(group) {
        if(currentGroup != "")
            {
                admin.hideGroup(currentGroup);
            }
        document.getElementById(group).style.display = "block";
        currentGroup = group;
    },

    hideGroup(group) {
        document.getElementById(group).style.display = "none";
    }
}

const data = {
    retrieveAbout() {
        let ref = db.ref(`/about/${userId}`)
        
        ref.once("value", function(snapshot) {
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
                (error ? console.log("Errors handled " + error) : console.log("Train successfully updated in the database. "));
            });

            // Clean up
            //document.getElementById("aboutForm").reset();
        }
    },
}

const validate = {
    aboutForm() {
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