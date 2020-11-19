import { url } from "../server/url.js";

const tableHandler = document.querySelector('#table-pointer');
const spinnerHandler = document.querySelector('.spinner');

window.addEventListener('DOMContentLoaded', async () => {
  spinnerHandler.style.display = 'block';
    const res = await fetch(url+"teams/list/");
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
        <td><img src="images/${team.pk}.png" alt="logo" onerror='this.style.background="${team.fields.team_color.toLowerCase()}"; this.src="images/zpxl.png";'/></td>
        <td>${team.pk}</td>
        <td>${team.fields.total_matches}</td>
        <td>${team.fields.points}</td>
        <td>${team.fields.wins}</td>
        <td>${team.fields.losses}</td>
        <td>${team.fields.nrr.toFixed(3)}</td>
      </tr>`;

      i+=1;
    });
    spinnerHandler.style.display = 'none';

})