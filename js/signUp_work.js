
const formRegister = document.getElementById('formRegister');

formRegister.onsubmit = (e) => {
    ClearErrors();
    e.preventDefault(); 
    const xhr = new XMLHttpRequest();
    const url = "https://goose.itstep.click/api/Account/register"; //443 // Replace with your actual API URL

    const data = {
        email: document.getElementById("email").value,
        firstName: document.getElementById("name").value,
        secondName: document.getElementById("surname").value,
        photo: document.getElementById("avatar").src,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const resp = xhr.responseText;
                const token = JSON.parse(resp).token;
                localStorage.setItem("token", token);
                localStorage.setItem('isLoggedIn', true);
                location.href = '/index.html';
                ClearFields();
            } else {
                console.error("Error:", xhr.status, xhr.responseText);
                HandleError(xhr.responseText);
                console.log(isLoggedIn);
            }
        }
    };

    xhr.send(JSON.stringify(data));
}


function HandleError(responseText) {
    const response = JSON.parse(responseText);
    if (response.errors) {
        for (const field in response.errors) {
            if (response.errors.hasOwnProperty(field)) {
                const fieldErrors = response.errors[field];
                console.log("field:",field,"error",fieldErrors);
                
                errorMessages = fieldErrors;
                switch (field) {
                    case "secondName": { surnameError.hidden = false; surnameError.textContent = errorMessages; break; }
                    case "firstName": { nameError.hidden = false; nameError.textContent = errorMessages; break; }
                    case "email": { emailError.hidden = false; emailError.textContent = errorMessages; break; }
                    case "phone": { phoneError.hidden = false; phoneError.textContent = errorMessages; break; }
                    case "password": { passwordError.hidden = false; passwordError.textContent = errorMessages; break; }
                    case "confirmPassword": { passwordError.hidden = false; passwordError.textContent = errorMessages; break; }
                }
            }
        }
    }
}

function ClearErrors() {
    surnameError.hidden = true;
    nameError.hidden = true;
    emailError.hidden = true;
    phoneError.hidden = true;
    passwordError.hidden = true;
}

function ClearFields() {
    document.getElementById("email").value = null;
    document.getElementById("name").value = null;
    document.getElementById("surname").value = null;
    document.getElementById("phone").value = null;
    document.getElementById("password").value = null;
    document.getElementById("confirmPassword").value = null;
    document.getElementById("avatar").src = '/images/no-avatar.png';
}