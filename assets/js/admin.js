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

let loginBtn = document.getElementById("login");
let logoutBtn = document.getElementById("logout");

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
    }
});

const auth = {
    login() {
        let provider = new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    },

    logout() {
        firebase.auth().signOut;
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

loginBtn.addEventListener("click", () => { auth.login(); });
logoutBtn.addEventListener("click", () => { auth.logout(); });

