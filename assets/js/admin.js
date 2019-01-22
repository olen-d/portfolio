//  Initialize Firebase
const config = {
    apiKey: "AIzaSyC-KLq7IYGv31TskNl4Bs7tXsqxqAB6dTE",
    authDomain: "devportfolio-29145.firebaseapp.com",
    databaseURL: "https://devportfolio-29145.firebaseio.com",
    projectId: "devportfolio-29145",
    storageBucket: "devportfolio-29145.appspot.com",
    messagingSenderId: "803504641717"
};

firebase.initializeApp(config);

let db = firebase.database();
let aboutRef = db.ref("/about");
let projsRef = db.ref("/projects");
let skillsRef = db.ref("/skills");
let themesRef = db.ref("themes");
let usersRef = db.ref("/users");

let displayName = "";
let photoURL = "";
let userId = "";
let currentGroup = "";

let loginBtn = document.getElementById("loginBtn");
let logoutBtn = document.getElementById("logoutBtn");
let aboutBtn = document.getElementById("aboutBtn");
let projectsBtn = document.getElementById("projectsBtn");
let skillsBtn = document.getElementById("skillsBtn");
let themesBtn = document.getElementById("themesBtn");

let aboutItems = [
    "firstName",
    "lastName",
    "title",
    "email",
    "tel",
    "address",
    "street",
    "city",
    "state",
    "zip",
    "bio"
];

const aboutData = new Object();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline";

        displayName = user.displayName;
        photoURL = user.photoURL;
        userId = user.uid;
//console.log("---- ", displayName);
//console.log(photoURL);
//console.log(userId);
        let providerData = user.providerData;

        // See if the user exists
        if (auth.userExists(userId)) {
            const lastLogin = { lastLogin: firebase.database.ServerValue.TIMESTAMP };
            db.ref(`/users/${userId}`).set(lastLogin, (error) => {
                (error ? console.log("Errors handled " + error) : console.log("Last login successfully updated. "));
            });
        } else {
            // User doesn't exist, add them to the Firebase Users
            const userData = {
                "name": displayName,
                "photo": photoURL,
                "joined": firebase.database.ServerValue.TIMESTAMP,
                "lastLogin": firebase.database.ServerValue.TIMESTAMP
            }
            console.log("///--/// ",userId);
            auth.addUser(userId, userData);
        }
    } else {
        //  Not signed in
        logoutBtn.style.display = "none";
        loginBtn.style.display = "inline";
    }
});

const auth = {
    login() {
        let provider = new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    },

    logout() {
//console.log(";;;;;; LOGOUT fireD")
        firebase.auth().signOut();
    },

    addUser(userId, userData) {
        if (!auth.userExists(userId)) {
            console.log("ADD USER FIRED");
            db.ref(`/users/${userId}`).set(userData, (error) => {
                (error ? console.log("Errors handled " + error) : console.log("User successfully added to the database. "));
            });
        }
    },

    userExists(userId) {
        usersRef.child(userId).once("value", (snapshot => {
            let exists = (snapshot.val() !== null);
//console.log("++--++ ",exists);
            return exists;
        }));   
    }
}

//  Firebase Authentication
firebase.auth().getRedirectResult().then((result) => {
    if (result.credential) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const token = result.credential.accessToken;
        // ...
    }
    // The signed-in user info.
    const user = result.user;
    }).catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    // The email of the user's account used.
    let email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    let credential = error.credential;
    // ...
});

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
                    document.getElementById(item).value = sv.item;
                });
                // document.getElementById("firstName").value = sv.firstName;
                // document.getElementById("lastName").value = sv.lastName;
                // document.getElementById("title").value = sv.title;
                // document.getElementById("email").value = sv.email;
                // document.getElementById("tel").value = sv.tel;
                // document.getElementById("address").value = sv.address;
                // document.getElementById("street").value = sv.street;
                // document.getElementById("city").value = sv.city;
                // document.getElementById("state").value = sv.state;
                // document.getElementById("zip").value = sv.zip;
                // document.getElementById("bio").value = sv.bio;
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

            aboutItems.forEach((key) => { //console.log("--- ",key); console.log("+++ ", document.getElementById("firstName"));
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