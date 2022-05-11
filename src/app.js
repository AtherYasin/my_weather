const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3500;

const hbs = require("hbs");

const publicFolderPath = path.join(__dirname, "../public");
const viewFolderPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");



app.set("view engine", "hbs");
app.set("views", viewFolderPath);
app.use(express.static(publicFolderPath));
hbs.registerPartials(partialPath);

const request = require("request");


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/city", (req, res) => {
    console.log(req.query.cityName);
    if (!req.query.cityName) res.send("Please provide City name ");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.query.cityName}&units=matric&callback=&appid=5064e39e4c4a34352a4691eda2db2627`;
    request({ url: url, json: true }, (error, response) => {
        console.log(response);
        if (response.statusCode === 404) {
            res.send(`You have provided wrong cityname (${response.body.message})`);
        } else {
            const data = response.body;
            // console.log(data);
            // let centigrade = data.main.temp - 273;
            // let fahrenheit = (centigrade * 9) / 5 + 32;
            res.send(data)

            // res.render("city", {
            //     name: data.name,
            //     temperature: data.main.temp,
            //     temperatureCentigrade: centigrade,
            //     temperatureFahrenheit: fahrenheit,
            //     description: data.weather[0].description,
            // });
        }
    });
});

app.get("/place", (req, res) => {
    if (!req.query.address) res.send("please provide address")
    let address = req.query.address

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoibmV2ZXJtb3JlNzQ3IiwiYSI6ImNsMmZ5aGd0MzBlYnkzYmtqODBsYjR6MW8ifQ.k3e5gpU_4aZ2n9ibQtp7bg&limit=1`;

    request({ url, json: true }, (err, response) => {
        const longitude = response.body.features[0].center[0];
        const latitude = response.body.features[0].center[1];

        const url = `http://api.weatherstack.com/current?access_key=cd2e3673f7206d5cc2dbd1c58c108697&query=${latitude},${longitude}`;
        // res.send(response.body);
        request({ url, json: true }, (err, response) => {
            console.log(response.body.current.temperature, longitude, latitude);
            let temp = `The Temperature is  ${response.body.current.temperature}  at the location of ${longitude} & ${latitude}`;
            res.send(temp);
        });
    });
});

app.get("/location", (req, res) => {

    if (!req.query.latlong) return res.send("please provide latitude and longitude")
    let latlong = req.query.latlong;
    const url = `http://api.weatherstack.com/current?access_key=cd2e3673f7206d5cc2dbd1c58c108697&query=${latlong}`;


    request({ url, json: true }, (err, response) => {
        if (err) return res.send("there is an error with request")
        console.log(err);
        // console.log(response);
        console.log(response.body)
        if (response.body.success === false) return res.send("please prove correct lattitude and longitude")

        let temp = `The Temperature is  ${response.body.current.temperature}  at ${response.body.location.name} ${response.body.location.country}`;
        res.send(temp);
    });
});

app.get("/yoyo", (req, res) => {
    res.render("yoyo");
});

app.listen(port, () => {
    console.log(`Listening at ${port}`);
});