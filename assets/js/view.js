let source = document.getElementById("portfolio-template").innerHTML; 
let template = Handlebars.compile(source);
let imagePage = document.getElementById("portfolio-page"); 
let contextString = "{";


retrieveAbout = new Promise ((resolve, reject) => {
    let ref = db.ref(`/about/${userId}`)
        
    ref.once("value", function(snapshot) {
        let sv = snapshot.val();

        if(sv !== null) {
            aboutItems.forEach((item) => {
                contextString += `"${item}:` + sv[item] + ", ";
                console.log("[[]]]]", userId, "------ ",contextString);
            });
            contextString = contextString.slice(0,-2);
            contextString += "}";
        }
    }); 
    resolve(contextString);

    // Handle any errors
    }, (errorObject) => {
        console.log("Errors handled: " + errorObject.code);
    reject("Fail");
});  


retrieveAbout
    .then((contextString) => {
        console.log("[[[]]] ",contextString);
        let context = JSON.parse(contextString);
        let html = template(context);
    });



