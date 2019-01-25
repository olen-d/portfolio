let source = document.getElementById("portfolio-template").innerHTML; 
let template = Handlebars.compile(source);
let imagePage = document.getElementById("portfolio-page"); 

let contextString = "{";

userId = "aTSIOrIboZWVaYv5RUwMWbbpZbx1";

let refAbout = db.ref(`/about/${userId}`)
    
refAbout.once("value").then((snapshot) => {
    let sv = snapshot.val();

    const aboutPromise = new Promise((resolve,reject) => {
        aboutItems.forEach((item) => {
            contextString += `"${item}": ` + `"${sv[item]}", `;
        });
        if(contextString.length > 1) {
            resolve(contextString);
        } else {
            reject(Error(500));
        }
    });

    aboutPromise.then((result) => {
        let refProjects = db.ref(`/projects/${userId}`)
        refProjects.orderByChild("projectTitle").on("child_added").then((snapshot) => {
            //let sk = snapshot.ref.key
            let psv = snapshot.val();
            contextString += `"projects: {"`
            projectItems.forEach((item) => {
                contextString += `"${item}": ` + `"${psv[item]}", `
                //console.log(sk);
                console.log(`"${item}": ` + `"${psv[item]}", `);
            });
        });
        
    }).then((result) => {
        contextString = contextString.slice(0,-2);
        contextString += "}";

        // Render the about template
        let context = JSON.parse(contextString);
        let html = template(context);
        imagePage.innerHTML += html
        
    });
   
});

// contextString = result.slice(0,-2);
//         contextString += "}";

        // Render the about template
        // let context = JSON.parse(contextString);
        // let html = template(context);
        // imagePage.innerHTML += html