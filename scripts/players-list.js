import {url} from '../server/url.js';

console.log(url);
const template = document.querySelector('.collection');

window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch(url+'players/list/');
    const playersList = await res.json();
    const data = playersList.data;

    data.forEach(player => {
        template.innerHTML += `<li class="collection-item avatar" id=${player.pk}>
                                    <i class="material-icons circle green">${player.pk}</i>
                                    <span class="title">${player.fields.first_name + " " + player.fields.last_name}</span>
                                    <p>${player.fields.date_of_birth} <br>
                                    ${player.fields.team ? player.fields.team : "Not included in any team"}
                                    </p>
                                </li>` ;
        
    });
})

template.addEventListener('click', (e) => {
    const playerId = e.target.closest('li').id;
    window.location.replace('./player.html?id='+playerId);
})