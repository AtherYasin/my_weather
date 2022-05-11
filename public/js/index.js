console.log("client side javascript");


// fetch("https://api.openweathermap.org/data/2.5/weather?q=karachi&units=matric&callback=&appid=5064e39e4c4a34352a4691eda2db2627").then((response) => {
//     response.json().then((data) => {
//         console.log(data);
//     })
// })

const weatherApp = document.querySelector("form")
const inputField = document.querySelector("input")

weatherApp.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log(inputField.value);

    fetch(`http://localhost:3500/city?cityName=${inputField.value}`).then((response) => {
        response.json().then((data) => {
            console.log(data);
        })
    })
})