let source = document.getElementById("portfolio-template").innerHTML; 
let template = Handlebars.compile(source);
let imagePage = document.getElementById("portfolio-page"); 

let contextString = "{";

userId = "aTSIOrIboZWVaYv5RUwMWbbpZbx1";


    let ref = db.ref(`/about/${userId}`)
        
    ref.once("value").then(function(snapshot) {
        let sv = snapshot.val();

        if(sv !== null) {
            const aboutPromise = new Promise((resolve,reject) => {
                aboutItems.forEach((item) => {
                    contextString += `"${item}":` + `"${sv[item]}", `;
    //console.log("[[]]]]", userId, "------ ",contextString);
                });
                if(contextString.length > 1) {
                    resolve(contextString);
                } else {
                    reject(Error(500));
                }
            });

            aboutPromise.then((result) => {
                contextString = result.slice(0,-2);
                contextString += "}";
            });
        }
    });
            



    // Handle any errors
    // }, (errorObject) => {
    //     console.log("Errors handled: " + errorObject.code);
    // reject("Fail");
// });  


// retrieveAbout
//     .then((contextString) => {
//         console.log("[[[]]] ",contextString);
//         let context = JSON.parse(contextString);
//         let html = template(context);
//     });

setTimeout(() => {
//console.log("[[[]]] ",contextString);
    let context = JSON.parse(contextString);
    let html = template(context);
    imagePage.innerHTML += html
},2000);