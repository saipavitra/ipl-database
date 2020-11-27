import { url } from "../server/url.js";

const form = document.querySelector('form');
const spinnerHandler = document.querySelector(".spinner");


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    spinnerHandler.style.display = "block";

    const obj = {username: form.username.value, email: form.email.value};

    console.log(obj);

    const res = await fetch(`${url}matches/add/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });
    const resData = await res.json();

    if(res.status >= 300) {
        alert("This username is already taken")
        spinnerHandler.style.display = "none";
        return;
    } else if(res.status < 300) {
        alert("you will be contacted soon....stay tuned...Check for mail")
    }

    console.log(resData);
    spinnerHandler.style.display = "none";

})