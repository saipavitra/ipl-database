import { url } from "../server/url.js";

const form = document.querySelector('form');
const spinnerHandler = document.querySelector(".spinner");


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    spinnerHandler.style.display = "block";

    const obj = {username: form.username.value, password: form.password.value};

    console.log(obj);

    const res = await fetch(`${url}rest-auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });
    const resData = await res.json();

    if(res.status >= 300) {
        alert("Please enter valid credential")
        spinnerHandler.style.display = "none";
        return;
    }

    console.log(resData.key);
    localStorage.setItem('key', resData.key);

    window.location.replace('./index.html');
    spinnerHandler.style.display = "none";

})