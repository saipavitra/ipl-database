import { url } from "../server/url.js";

const tableHandler = document.querySelector('#table-pointer');
const spinnerHandler = document.querySelector('.spinner');
const selectHandler = document.querySelector("#inputGroupSelect01");

window.addEventListener('DOMContentLoaded', async () => {
  spinnerHandler.style.display = 'block';

  const seasonRes = await fetch(url + "matches/season/list/",{
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const seasonData = await seasonRes.json();

  const seasons = seasonData.data;
  let j = 0;
  seasons.forEach(sea => {
    if(j===0) {
      selectHandler.value = sea.fields.season;
      j+=1;
    }
    selectHandler.innerHTML += `<option value=${sea.fields.season}>${sea.fields.season}</option>`
  });


    const res = await fetch(url+"teams/"+selectHandler.value+"/list/",{
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer "+localStorage.getItem('key')
      }
    });
    const teamData = await res.json();
    console.log(teamData.data);
    const data = teamData.data;
    let i = 1;
    data.forEach(team => {
      let imagePresnt = false;
      if(team.pk === "DC" || team.pk === "DD" || team.pk === "RCB" || team.pk === "KKR" || team.pk === "CSK" || team.pk === "KXIP" || team.pk === "MI" || team.pk === "SRH" || team.pk === "RR") {
        imagePresnt = true;
      }
        tableHandler.innerHTML += `
        <tr class=${i%2==0 ? 'active-row' : "" }>
        <th scope="row">${i}</th>
        <td><img src="images/${team.fields.team_name}.png" alt="logo" onerror='this.style.background="${team.fields.team_color.toLowerCase()}"; this.src="images/zpxl.png";'/></td>
        <td>${team.fields.team_name}</td>
        <td>${team.fields.total_matches}</td>
        <td>${team.fields.points}</td>
        <td>${team.fields.wins}</td>
        <td>${team.fields.losses}</td>
        <td>${team.fields.nrr.toFixed(3)}</td>
      </tr>`;

      i+=1;
    });
    spinnerHandler.style.display = 'none';

});

selectHandler.addEventListener('change', async (e) => {

  spinnerHandler.style.display = "block";

  const response = await fetch(url + "teams/"+selectHandler.value+"/list/",{
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const resData = await response.json();
  const data = resData.data;
  console.log(data);
  let i = 1;
  tableHandler.innerHTML = '';
    data.forEach(team => {
      let imagePresnt = false;
      if(team.pk === "DC" || team.pk === "DD" || team.pk === "RCB" || team.pk === "KKR" || team.pk === "CSK" || team.pk === "KXIP" || team.pk === "MI" || team.pk === "SRH" || team.pk === "RR") {
        imagePresnt = true;
      }
        tableHandler.innerHTML += `
        <tr class=${i%2==0 ? 'active-row' : "" }>
        <th scope="row">${i}</th>
        <td><img src="images/${team.fields.team_name}.png" alt="logo" onerror='this.style.background="${team.fields.team_color.toLowerCase()}"; this.src="images/zpxl.png";'/></td>
        <td>${team.fields.team_name}</td>
        <td>${team.fields.total_matches}</td>
        <td>${team.fields.points}</td>
        <td>${team.fields.wins}</td>
        <td>${team.fields.losses}</td>
        <td>${team.fields.nrr.toFixed(3)}</td>
      </tr>`;

      i+=1;
    });

  spinnerHandler.style.display = "none";
});