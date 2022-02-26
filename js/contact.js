const submitBtn = document.querySelector('#submit');
const form = document.querySelector('form');

submitBtn.addEventListener("click", function(event) {
    event.preventDefault();

    let validInput = [];

    form.childNodes.forEach(node => {
        let validMinLength;
        switch(node.id) {
            case("name"):
                validMinLength = 5;
                break;
            case("subject"):
                validMinLength = 15;
                break;
            case("message"):
                validMinLength = 25;
                break;
        };

        if(node.tagName === "INPUT" || node.tagName === "TEXTAREA") {
            if(node.id === "email"){
                if(validEmail(node)) {
                    validInput.push(node.value);
                }
            } else {
                if(validLength(node, validMinLength)) {
                    validInput.push(node.value);
                };
            }
        }
    });
    if(validInput.length === 4) {
        //if validInput has the length of 4, it means all input has been validated. I'd probably parse an object as JSON when posting it
        //but since I don't know how to post, I'll just leave it here :)
        const validInputObject = {
            name : validInput[0],
            subject : validInput[1],
            email : validInput[2],
            message : validInput[3]
        }
        console.log(validInputObject);
        alert("Let's pretend that your message got sent. I don't know how to post to the backend yet... :)");
    }
});


function validLength(node, validLength) {
    const sibling = node.nextElementSibling;
    if(node.value.trim().length > validLength) {
        node.classList.replace(node.className, "form-element-valid");
        sibling.classList.replace(sibling.className, "error");
        sibling.innerHTML = "";
        return true;
    } else {
        node.classList.replace(node.className, "form-element-invalid");
        sibling.classList.replace(sibling.className, "error-active");
        if(node.value.trim() === "") {
            sibling.innerHTML = `Empty input`;
        } else {
            sibling.innerHTML = `Input needs to be longer than ${validLength} characters`;
        }
    }
}

function validEmail(email) {
    const sibling = email.nextElementSibling;
    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(emailReg.test(email.value)) {
        email.classList.replace(email.className, "form-element-valid");
        sibling.classList.replace(sibling.className, "error");
        sibling.innerHTML = "";
        return true;
    } else {
        email.classList.replace(email.className, "form-element-invalid");
        sibling.classList.replace(sibling.className, "error-active");
        if(email.value.trim() === "") {
            sibling.innerHTML = `Empty input`;
        } else {
            sibling.innerHTML = "Invalid e-mail format";
        }
    }
}