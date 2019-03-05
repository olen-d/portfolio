const btnListener = {

    add (elem) {
        elem.addEventListener("click", function (e) {
            e.preventDefault();
            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let message = document.getElementById("message").value;
            // TODO: Validate this mess

            let data = {
                name: name,
                email: email,
                message: message
            }

            ajax.post("api/contact/send", data);
        });
    }

}

// Handle AJAX requests
const ajax = {
    post(url, data) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 200) {
                let jData = JSON.parse(xhr.responseText);

                // Clear the form fields
                document.getElementById("name").value = "";
                document.getElementById("email").value = "";
                document.getElementById("message").value = "";

                // Build & output the success message
                let msgStatus = document.getElementById("message-status");
                let p = document.createElement("p");

                p.setAttribute("class", "success");
                p.innerText = `Thank you for getting in touch, your message was successfully sent to ${jData.accepted}. You can expect a response within 24 hours.`;

                msgStatus.appendChild(p);
                msgStatus.style.display = "block";
            } else {
                // Fail. TODO: Add error message.
            }
        };
        xhr.send(JSON.stringify({
            data
        }));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Add the rest of the event listeners

    let submitBtn = document.getElementById("submitMessage");
    btnListener.add(submitBtn);
  });