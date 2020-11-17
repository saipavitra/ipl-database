import { url } from "../server/url.js";

console.log(url);
const template = document.querySelector(".collection");
const spinnerHandler = document.querySelector('.spinner');

window.addEventListener("DOMContentLoaded", async () => {
  spinnerHandler.style.display = 'block';
  const res = await fetch(url + "matches/list/");
  const playersList = await res.json();
  const data = playersList.data;

  console.log(data);
  data.forEach((player) => {
    template.innerHTML += `<li class="collection-item avatar" id=${player.pk}>
                                    <i class="material-icons circle green"><p class="top-view-id">${
                                      player.pk
                                    }</p></i> 
                                    <span class="title">${
                                      player.fields.team_one +
                                      " vs " +
                                      player.fields.team_two
                                    }</span>
                                    <p>${player.fields.toss} won the toss and elected to ${player.fields.elected === 'B'? "Bat": "Bowl"},<br>
                                     First innings ${player.fields.first_inning_score} - overs ${player.fields.first_inning_over} Second innings ${player.fields.second_inning_score} - overs ${player.fields.second_inning_over} <br>
                                    ${
                                      player.fields.match_won
                                    } won the match
                                    </p>
                                </li>`;

                                
  });

  spinnerHandler.style.display = 'none';
});


