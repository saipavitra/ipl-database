import { url } from "../server/url.js";

console.log(url);
const template = document.querySelector(".collection");
let data;

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(url + "players/list/");
  const playersList = await res.json();
  data = playersList.data;

  data.forEach((player) => {
    template.innerHTML += `<li class="collection-item avatar" id=${player.pk}>
                                    <i class="material-icons circle green"><p class="top-view-id">${
                                      player.pk
                                    }</p></i> 
                                    <span class="title">${
                                      player.fields.first_name +
                                      " " +
                                      player.fields.last_name
                                    }</span>
                                    <p>${player.fields.date_of_birth} <br>
                                    ${
                                      player.fields.team
                                        ? player.fields.team
                                        : "Not included in any team"
                                    }
                                    </p>
                                     <a href="#!" class="secondary-content delKey" id=${
                                       player.pk
                                     }><i class="material-icons">delete</i></a>
                                </li>`;
  });
  const delKey = document.querySelectorAll(".delKey");
  console.log(delKey);
  delKey.forEach((ele) => {
    ele.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = e.target.parentElement.id;

        const res = await fetch(url+'players/delete/'+id+'/', {
            method: 'POST',
            body: {},
            headers: {
              'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        console.log(data);


    });
  }, true);

  const dataSetHandler = document.querySelector('#datalist');
  const response = await fetch(url+"teams/list/");
  const resData = await response.json();
  const teamData = resData.data;
  console.log(teamData)
  teamData.forEach(team => {
    dataSetHandler.innerHTML += `<option value=${team.pk}></option>`
  });


});

template.addEventListener("click", (e) => {
  const playerId = e.target.closest("li").id;
  window.location.replace("./player.html?id=" + playerId);
});

const form = document.querySelector('.waves-effect');
const teamName = document.querySelector('.team-name');
form.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(template);
  template.innerHTML = '';
  data.forEach((player) => {
    if(player.fields.team === teamName.value) {
      
      template.innerHTML += `<li class="collection-item avatar" id=${player.pk}>
                                      <i class="material-icons circle green"><p class="top-view-id">${
                                        player.pk
                                      }</p></i> 
                                      <span class="title">${
                                        player.fields.first_name +
                                        " " +
                                        player.fields.last_name
                                      }</span>
                                      <p>${player.fields.date_of_birth} <br>
                                      ${
                                        player.fields.team
                                          ? player.fields.team
                                          : "Not included in any team"
                                      }
                                      </p>
                                       <a href="#!" class="secondary-content delKey" id=${
                                         player.pk
                                       }><i class="material-icons">delete</i></a>
                                  </li>`;
    }
  });

});
