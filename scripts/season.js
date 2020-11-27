import { url } from "../server/url.js";


const formHandler = document.querySelector("form");
const spinnerHandler = document.querySelector(".spinner");


formHandler.addEventListener('submit', async (e) => {
    e.preventDefault();
    spinnerHandler.style.display = "block";
    const obj = {year: formHandler.year.value};

    try {
        const res = await fetch(`${url}matches/add/season/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "authorization": "Bearer "+localStorage.getItem('key')
            },
            body: JSON.stringify(obj),
        });
        const resData = await res.json();

        if(res.status < 300) {
            $('#exampleModalCenterSuccess').modal('show')
            formHandler.year.value="";
        } else {
            alert(resData.message)
        }
    
        // console.log(resData);

    } catch(err) {
        console.log(err.message);
    }


    spinnerHandler.style.display = "none";


});