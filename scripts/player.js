import { url } from "../server/url.js";


try{
  ky = localStorage.getItem('key');
  if(!ky) {
    window.location.replace("./login.html")
  }
} catch (e) {
  // window.location.replace("./login.html")
}


const id = new URLSearchParams(window.location.search).get("id");

const form = document.querySelector("form");
const headingToggler = document.querySelector("#heading-handler");
const dataSetHandler = document.querySelector("#datalist");
const spinnerHandler = document.querySelector(".spinner");
const selectHandler = document.querySelector("#inputGroupSelect01");

window.addEventListener("DOMContentLoaded", async () => {
  spinnerHandler.style.display = "block";

  const seasonRes = await fetch(url + "matches/season/list/", {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const seasonData = await seasonRes.json();

  const seasons = seasonData.data;
  if(seasons.length === 0) {
    alert("Please Add the IPL season before adding matches");
    window.location.replace('./season.html');
    return;
}
  let j = 0;
  seasons.forEach(sea => {
    if(j===0) {
      selectHandler.value = sea.fields.season;
      j=1;
    }
    selectHandler.innerHTML += `<option value=${sea.fields.season}>${sea.fields.season}</option>`
  });


  if (id) {
    const res = await fetch(url + "players/details/" + id + "/", {
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer "+localStorage.getItem('key')
      }
    });
    const playerData = await res.json();
    const data = playerData.data;
    console.log(data)

    form.first_name.value = data.first_name;
    form.last_name.value = data.last_name;
    form.date_of_birth.value = data.date_of_birth;
    form.nationality.value = data.nationality;
    form.team.value = data.team_name;
    selectHandler.value = data.year

    headingToggler.innerHTML = "Update Player";
  }

  const response = await fetch(url + "teams/"+selectHandler.value+"/list/", {
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const resData = await response.json();
  console.log(resData)
  const teamData = resData.data;
  teamData.forEach((team) => {
    dataSetHandler.innerHTML += `<option value=${team.fields.team_name}></option>`;
    if(team.pk==form.team.value && id) {
      form.team.value = team.fields.team_name;
    }
  });

  spinnerHandler.style.display = "none";
});

selectHandler.addEventListener('change', async (e) => {

  spinnerHandler.style.display = "block";

  const response = await fetch(url + "teams/"+selectHandler.value+"/list/", {
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const resData = await response.json();
  const teamData = resData.data;
  console.log(teamData);
  dataSetHandler.innerHTML = ``;
  teamData.forEach((team) => {
    dataSetHandler.innerHTML += `<option value=${team.fields.team_name}></option>`;
  });

  spinnerHandler.style.display = "none";
});


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  spinnerHandler.style.display = "block";
  let statusCode;

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
          season: selectHandler.value
        },
      };

      const jsonData = JSON.stringify(obj);

      const res = await fetch(`${url}players/update/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer "+localStorage.getItem('key')

        },
        body: jsonData,
      });
      const response = await res.json();
      console.log(response);
      statusCode = res.status;
    } else {
      const obj = {
        body: {
          first_name: form.first_name.value,
          last_name: form.last_name.value,
          date_of_birth: form.date_of_birth.value,
          nationality: form.nationality.value,
          team: form.team.value,
          season: selectHandler.value
        },
      };

      const jsonData = JSON.stringify(obj);

      const res = await fetch(`${url}players/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer "+localStorage.getItem('key')
        },
        body: jsonData,
      });
      const response = await res.json();
      statusCode = res.status;

    }

    if(statusCode >= 400) {
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
  form.first_name.value = "";
  form.last_name.value = "";
  form.date_of_birth.value = "";
  form.nationality.value = "";
  form.team.value = "";
};

const displaySuccessMessage = () => {
  $('#exampleModalCenterSuccess').modal('show')
}
