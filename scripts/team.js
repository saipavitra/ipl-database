import { url } from "../server/url.js";

const formHandler = document.querySelector('form');

formHandler.addEventListener('submit', async (e) => {
    e.preventDefault();

    const obj = {team_name: formHandler.team_name.value, team_color: formHandler.team_color.value};
    const jsonObj = JSON.stringify(obj);

    const res = await fetch(`${url}teams/add/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: jsonObj
    });
    const resData = await res.json();
    console.log(resData);
})