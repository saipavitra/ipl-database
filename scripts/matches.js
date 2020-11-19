import { url } from "../server/url.js";

const form = document.querySelector("form");
const dataSetHandler = document.querySelector('#datalist');
const spinnerHandler = document.querySelector('.spinner');

let teamData;

window.addEventListener("DOMContentLoaded", async () => {
    spinnerHandler.style.display = 'block';

  const response = await fetch(url+"teams/list/");
  const resData = await response.json();
  teamData = resData.data;
  console.log(teamData)
  teamData.forEach(team => {
    dataSetHandler.innerHTML += `<option value=${team.pk}></option>`
  });

  spinnerHandler.style.display = 'none';
});


const formCheckHandler = () => {
    if(form.team_one.value === form.team_two.value) {
        return 0;
    } else if (!(form.team_one.value === form.match_won.value || form.team_two.value === form.match_won.value)) {
        return 0;
    } else if (!(form.team_one.value === form.toss.value || form.team_two.value === form.toss.value)) {
        return 0;
    }
    return 1;
}

const clearForm = () => {
    form.team_one.value = '';
    form.team_two.value = '';
    form.toss.value = '';
    form.elected.value = '';
    form.first_inning_over.value = null;
    form.first_inning_score.value = null;
    form.second_inning_over.value = null;
    form.second_inning_score.value = null;
    form.match_won.value = '';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if ( !formCheckHandler() ) {
        $('#exampleModalCenter').modal('show')
        return;
    }

    spinnerHandler.style.display = 'block';
    let new_nrr_1, new_nrr_2;
    let new_total_matches_1, new_total_matches_2;
    let new_points_1, new_points_2;
    let new_wins_1, new_wins_2;
    let new_losses_1, new_losses_2;
    const team = teamData[0];
    console.log(team.fields.total_matches);
    console.log(typeof(team.fields.total_matches), typeof(team.fields.total_matches));
    // console.log(team.total_matches*team.nrr + (form.first_inning_score.value/form.first_inning_over.value-form.second_inning_score.value/form.second_inning_over.value))


    teamData.forEach(team => {
        if(team.pk === form.team_one.value) {
            if((form.elected.value==="bat"&&form.toss.value===team.pk) || (form.elected.value!=="bat"&&form.toss.value!==team.pk)) {
                new_nrr_1 = (1.0/(team.fields.total_matches+1))*(team.fields.total_matches*team.fields.nrr + (form.first_inning_score.value/form.first_inning_over.value-form.second_inning_score.value/form.second_inning_over.value));
            } else {
                new_nrr_1 = (1.0/(team.fields.total_matches+1))*(team.fields.total_matches*team.fields.nrr - (form.first_inning_score.value/form.first_inning_over.value-form.second_inning_score.value/form.second_inning_over.value));
            }
            new_total_matches_1 = team.fields.total_matches+1;
            if(form.match_won.value === team.pk) {
                new_points_1 = team.fields.points+2;
                new_wins_1 = team.fields.wins + 1;
                new_losses_1 = team.fields.losses;
            } else {
                new_points_1 = team.fields.points;
                new_wins_1 = team.fields.wins;
                new_losses_1 = team.fields.losses + 1;

            }
        }
    });
    teamData.forEach(team => {
        if(team.pk === form.team_two.value) {
            if((form.elected.value==="bat"&&form.toss.value===team.pk) || (form.elected.value!=="bat"&&form.toss.value!==team.pk)) {
                new_nrr_2 = (1.0/(team.fields.total_matches+1))*(team.fields.total_matches*team.fields.nrr + (form.first_inning_score.value/form.first_inning_over.value-form.second_inning_score.value/form.second_inning_over.value));
            } else {
                new_nrr_2 = (1.0/(team.fields.total_matches+1))*(team.fields.total_matches*team.fields.nrr - (form.first_inning_score.value/form.first_inning_over.value-form.second_inning_score.value/form.second_inning_over.value));
            }
            new_total_matches_2 = team.fields.total_matches+1;
            
            if(form.match_won.value === team.pk) {
                new_points_2 = team.fields.points+2;
                new_wins_2 = team.fields.wins + 1;
                new_losses_2 = team.fields.losses;
            } else {
                new_points_2 = team.fields.points;
                new_wins_2 = team.fields.wins;
                new_losses_2 = team.fields.losses + 1;

            }            
        }
    });

    console.log(new_nrr_1, new_nrr_2);

    const obj = {
        team_one: form.team_one.value,
        team_two: form.team_two.value,
        toss: form.toss.value,
        elected: form.elected.value,
        first_inning_score: form.first_inning_score.value,
        first_inning_over: form.first_inning_over.value,
        second_inning_score: form.second_inning_score.value,
        second_inning_over: form.second_inning_over.value,
        match_won: form.match_won.value,
        new_nrr_1: new_nrr_1,
        new_nrr_2: new_nrr_2,
        new_total_matches_1: new_total_matches_1,
        new_total_matches_2: new_total_matches_2,
        new_points_1: new_points_1,
        new_points_2: new_points_2,
        new_wins_1: new_wins_1,
        new_wins_2: new_wins_2,
        new_losses_1: new_losses_1,
        new_losses_2: new_losses_2,
    };
    console.log(obj);
    const json_data = JSON.stringify(obj);

    try {
        const res = await fetch(url+'matches/add/', {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: json_data
        });
        const response = await res.json();
        console.log(response.data);
        spinnerHandler.style.display = 'none';

        clearForm();
        
    } catch(err) {
        $('#exampleModalCenterTwo').modal('show')
        console.log(err.status);
        spinnerHandler.style.display = 'none';
    }

})