import { url } from "../server/url.js";

const formHandler = document.querySelector("form");
const spinnerHandler = document.querySelector(".spinner");
let teamData;

window.addEventListener("DOMContentLoaded", async () => {
  spinnerHandler.style.display = "block";

  const response = await fetch(url + "teams/list/");
  const resData = await response.json();
  teamData = resData.data;

  spinnerHandler.style.display = "none";
});

formHandler.addEventListener("submit", async (e) => {
  e.preventDefault();
  let flag = 0;
  teamData.forEach(team => {
    if(team.pk === formHandler.team_name.value) {
      $('#exampleModalCenter').modal('show');
      flag = 1;
    }
  });

  if(flag === 1) {
    return
  }

  try {
    const obj = {
      team_name: formHandler.team_name.value,
      team_color: formHandler.team_color.value,
    };
    const jsonObj = JSON.stringify(obj);
    spinnerHandler.style.display = "block";
    const res = await fetch(`${url}teams/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonObj,
    });
    const resData = await res.json();
    console.log(resData);

    if(res.status >= 400) {
      $('#exampleModalCenter').modal('show');

    } else {
      clearForm();
  
      displaySuccessMessage();

    }
    
    } catch (err) {
      $('#exampleModalCenter').modal('show')
    }
    spinnerHandler.style.display = "none";
});

const clearForm = () => {
  formHandler.team_name.value = "";
  formHandler.team_color.value = "";
};

const displaySuccessMessage = () => {
  $('#exampleModalCenterSuccess').modal('show')
}
