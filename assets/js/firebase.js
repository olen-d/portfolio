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