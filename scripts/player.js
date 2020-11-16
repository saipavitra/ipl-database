import { url } from "../server/url.js";

const id = new URLSearchParams(window.location.search).get("id");

const form = document.querySelector('form');

window.addEventListener("DOMContentLoaded", async () => {
  if (id) {
    const res = await fetch(url + "players/details/" + id + "/");
    const playerData = await res.json();
    const data = playerData.data;

    form.first_name.value = data.first_name;
    form.last_name.value = data.last_name;
    form.date_of_birth.value = data.date_of_birth;
    form.team.value = data.team;
  }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const obj = {body: {first_name: form.first_name.value, last_name: form.last_name.value,
                 date_of_birth: form.date_of_birth.value, team: form.team.value}};

    const jsonData = JSON.stringify(obj);

    const res = await fetch(`${url}players/add/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: jsonData
    });
    const response = await res.json();
    console.log(response);
});
