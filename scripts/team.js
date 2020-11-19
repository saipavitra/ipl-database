import { url } from "../server/url.js";

const formHandler = document.querySelector("form");
const spinnerHandler = document.querySelector(".spinner");

formHandler.addEventListener("submit", async (e) => {
  e.preventDefault();

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
    clearForm();
    
    } catch (err) {
        alert(err.message +"\nPlease check the team name (It may be existing or invalid credentials)");
    }
    spinnerHandler.style.display = "none";
});

const clearForm = () => {
  formHandler.team_name.value = "";
  formHandler.team_color.value = "";
};
