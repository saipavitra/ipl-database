import { url } from "../server/url.js";

const tableHandler = document.querySelector('#table-pointer');

window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch(url+"teams/list/");
    const teamData = await res.json();
    console.log(teamData.data);
    const data = teamData.data;
    let i = 1;
    data.forEach(team => {
        tableHandler.innerHTML += `
        <tr class=${i%2==0 ? 'active-row' : "" }>
        <th scope="row">${i}</th>
        <td><img src="images/${team.pk}.png" alt="logo" /></td>
        <td>${team.pk}</td>
        <td>${team.fields.total_matches}</td>
        <td>${team.fields.points}</td>
        <td>${team.fields.wins}</td>
        <td>${team.fields.losses}</td>
        <td>${team.fields.nrr}</td>
      </tr>`;

      i+=1;
    });

})