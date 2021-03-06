import { url } from "../server/url.js";

const ky = localStorage.getItem('key');
if(!ky) {
  window.location.replace("./login.html")
}


console.log(url);
const template = document.querySelector(".collection");
const spinnerHandler = document.querySelector('.spinner');
const form = document.querySelector('form');

window.addEventListener("DOMContentLoaded", async () => {
  spinnerHandler.style.display = 'block';

  const seasonRes = await fetch(url + "matches/season/list/",{
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const seasonData = await seasonRes.json();

  const seasons = seasonData.data;
  const selectHandler = document.querySelector('#datalist');
  console.log(seasons)
  selectHandler.innerHTML='';
  let i = 0;
  seasons.forEach(sea => {
    if(i===0) {
      form.year.value = sea.fields.season;
    }
    i+=1;
    selectHandler.innerHTML += `<option value=${sea.fields.season}></option> `
    
  });


  const res = await fetch(url + "matches/"+form.year.value+"/list/",{
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const playersList = await res.json();
  const data = playersList.data;

  console.log(data);
  data.forEach((player) => {
    template.innerHTML += `<li class="collection-item avatar" id=${player.pk}>
                                    <i class="material-icons circle green"><p class="top-view-id">${
                                      player.pk
                                    }</p></i> 
                                    <span class="title">${
                                      player.fields.team_one_txt +
                                      " vs " +
                                      player.fields.team_two_txt
                                    }</span>
                                    <p>${player.fields.toss_txt} won the toss and elected to ${player.fields.elected === 'B'? "Bat": "Bowl"},<br>
                                     First innings ${player.fields.first_inning_score} - overs ${player.fields.first_inning_over} Second innings ${player.fields.second_inning_score} - overs ${player.fields.second_inning_over} <br>
                                    ${
                                      player.fields.match_won_txt
                                    } won the match
                                    </p>
                                </li>`;

                                
  });

  // const seasonRes = await fetch(url + "matches/season/list/",{
  //   headers: {
  //     "Content-Type": "application/json",
  //     "authorization": "Bearer "+localStorage.getItem('key')
  //   }
  // });
  // const seasonData = await seasonRes.json();

  // const seasons = seasonData.data;
  // const selectHandler = document.querySelector('#datalist');
  // console.log(seasons)
  // selectHandler.innerHTML='';
  // seasons.forEach(sea => {
  //   if(sea.fields.season)
  //   selectHandler.innerHTML += `<option value=${sea.fields.season}></option> `
    
  // });

  spinnerHandler.style.display = 'none';
});

const submitForm = document.querySelector('#submitform');
submitForm.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log(form.year.value)

  const res = await fetch(url +"matches/"+ form.year.value +"/list/", {
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const playersList = await res.json();
  const data = playersList.data;

  template.innerHTML = '';
  console.log(data);
  data.forEach((player) => {
    template.innerHTML += `<li class="collection-item avatar" id=${player.pk}>
                                    <i class="material-icons circle green"><p class="top-view-id">${
                                      player.pk
                                    }</p></i> 
                                    <span class="title">${
                                      player.fields.team_one_txt +
                                      " vs " +
                                      player.fields.team_two_txt
                                    }</span>
                                    <p>${player.fields.toss_txt} won the toss and elected to ${player.fields.elected === 'B'? "Bat": "Bowl"},<br>
                                     First innings ${player.fields.first_inning_score} - overs ${player.fields.first_inning_over} Second innings ${player.fields.second_inning_score} - overs ${player.fields.second_inning_over} <br>
                                    ${
                                      player.fields.match_won_txt
                                    } won the match
                                    </p>
                                </li>`;

                                
  });
})