const express = require('express');

const path = require('path');
const https = require('https')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));


// app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, "index.html"));
// })
app.get('/', (req, res) => {
    const filePath = path.resolve(__dirname, "index.html");
    console.log("Attempting to send file:", filePath);
    res.sendFile(filePath);
});
app.post('/', (req, res) => {
    const query = req.body.cityName;
    const apiKey = 'aae1d22258f39cb84ebe1dd2a6794674';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey + '&units=metric';

    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const weatherData = JSON.parse(data);

                // Check if the required properties exist in the response
                if (weatherData && weatherData.main && weatherData.weather && weatherData.weather[0]) {
                    const temp = weatherData.main.temp;
                    const description = weatherData.weather[0].description;
                    res.write("<h1>The temperature in " + query + " is " + temp + " degree Celsius</h1>");
                    res.write("The weather description is: " + description);
                } else {
                    res.write("Error: Unable to retrieve valid weather data for " + query);
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.write("Error: Unable to parse weather data");
            } finally {
                res.end();
            }
        });
    });
});


    // const query='delhi'
    // const apiKey='aae1d22258f39cb84ebe1dd2a6794674'
    // const url='https://api.openweathermap.org/data/2.5/weather?q='+ query + '&appid='+apiKey +'&units=metric'
    // https.get(url,(response)=>{
    //     console.log(response)
    //     response.on('data',(data)=>{
    //         // console.log(data)
    //         const weatherData=JSON.parse(data);
    //         console.log(weatherData);
    //         const temp=weatherData.main.temp;
    //         const description=weatherData.weather[0].description
    //         // console.log(temp);
    //         res.write("<h1>The temp.in Delhi "+ temp + " degree celcius </h1>")
    //         res.write("The weather description is few clouds")
    //     })
    // })
    

app.listen(3000,()=>console.log("our server is running at port 3000"))

