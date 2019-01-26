let source = document.getElementById("portfolio-template").innerHTML; 
let template = Handlebars.compile(source);
let imagePage = document.getElementById("portfolio-page"); 

let contextString = ``;


userId = "aTSIOrIboZWVaYv5RUwMWbbpZbx1";

let refAbout = db.ref(`/about/${userId}`)   
refAbout.once("value").then((snapshot) => {
    let sv = snapshot.val();

    const aboutPromise = new Promise((resolve,reject) => {
        contextString = `{`;
        aboutItems.forEach((item) => {
            contextString += `"${item}": ` + `"${sv[item]}", `;
        });
        resolve(contextString);
    });
});

let refProjects = db.ref(`/projects/${userId}`);
refProjects.orderByChild("projectTitle").on("value", (snapshot) => {
    contextString += `"projects": [{`;
    const projectsPromise = new Promise((resolve,reject) => {
        snapshot.forEach((childSnapShot) => {
            let ck = childSnapShot.key;
            let cv = childSnapShot.val();
            projectItems.forEach((item) => {
                contextString += `"${item}": ` + `"${cv[item]}", `
            });
            contextString = contextString.slice(0,-2);
            contextString += `}, {`
            resolve(contextString);
        });
    });
    contextString = contextString.slice(0,-3);
    contextString += "] }";
    let context = JSON.parse(contextString);
    let html = template(context);
    imagePage.innerHTML += html
});