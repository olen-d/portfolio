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

let loginBtn = document.getElementById("login");

const auth = {
    login() {
        let provider = new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    },

    addUser(userId, userData) {
        if (!auth.userExists(userId)) {
            db.ref(`/users/${userId}`).set(userData, (error) => {
                (error ? console.log("Errors handled " + error) : console.log("User successfully added to the database. "));
            });
        }
    },

    userExists(userId) {
        usersRef.child(userId).once("value", (snapshot => {
            let exists = (snapshot.val() !== null);
            return exists;
        });    
    }
}

//  Firebase Authentication
firebase.auth().getRedirectResult().then(function(result) {
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

loginBtn.addEventListener("click", () => {
    auth.login();
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in
        hGlobal["displayName"] = user.displayName;
        hGlobal["photoURL"] = user.photoURL;
        hGlobal["userId"] = user.uid;


        let providerData = user.providerData;

        // See if the user exists
        if (userExists(hGlobal.userId)) {
            const lastLogin = { lastLogin: firebase.database.ServerValue.TIMESTAMP };
            db.ref(`/users/${hGlobal.userId}`).set(lastLogin, (error) => {
                (error ? console.log("Errors handled " + error) : console.log("Last login successfully updated. "));
            });
        } else {
            // User doesn't exist, add them to the Firebase Users
            const userData = {
                "name": hGlobal.displayName,
                "photo": hGlobal.photoURL,
                "joined": firebase.database.ServerValue.TIMESTAMP,
                "lastLogin": firebase.database.ServerValue.TIMESTAMP
            }
            addUser(hGlobal.userId, userData);
        }