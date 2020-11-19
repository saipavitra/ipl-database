import { url } from "../server/url.js";

const id = new URLSearchParams(window.location.search).get("id");

const form = document.querySelector("form");
const headingToggler = document.querySelector("#heading-handler");
const dataSetHandler = document.querySelector("#datalist");
const spinnerHandler = document.querySelector(".spinner");

window.addEventListener("DOMContentLoaded", async () => {
  spinnerHandler.style.display = "block";
  if (id) {
    const res = await fetch(url + "players/details/" + id + "/");
    const playerData = await res.json();
    const data = playerData.data;

    form.first_name.value = data.first_name;
    form.last_name.value = data.last_name;
    form.date_of_birth.value = data.date_of_birth;
    form.team.value = data.team;

    headingToggler.innerHTML = "Update Player";
  }

  const response = await fetch(url + "teams/list/");
  const resData = await response.json();
  const teamData = resData.data;
  teamData.forEach((team) => {
    dataSetHandler.innerHTML += `<option value=${team.pk}></option>`;
  });

  spinnerHandler.style.display = "none";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  spinnerHandler.style.display = "block";

  try {
    if (id) {
      const obj = {
        body: {
          pk: id,
          first_name: form.first_name.value,
          last_name: form.last_name.value,
          date_of_birth: form.date_of_birth.value,
          nationality: form.nationality.value,
          team: form.team.value,
        },
      };

      const jsonData = JSON.stringify(obj);

      const res = await fetch(`${url}players/update/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });
      const response = await res.json();
      console.log(response);
    } else {
      const obj = {
        body: {
          first_name: form.first_name.value,
          last_name: form.last_name.value,
          date_of_birth: form.date_of_birth.value,
          nationality: form.nationality.value,
          team: form.team.value,
        },
      };

      const jsonData = JSON.stringify(obj);

      const res = await fetch(`${url}players/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });
      const response = await res.json();
      console.log(response);
    }

    clearForm();
    
  } catch (err) {
    $('#exampleModalCenter').modal('show')
  }


  spinnerHandler.style.display = "none";
});

const clearForm = () => {
  form.first_name.value = "";
  form.last_name.value = "";
  form.date_of_birth.value = "";
  form.nationality.value = "";
  form.team.value = "";
};
