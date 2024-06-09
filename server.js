const express = require('express');
const http = require('http');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT ? process.env.PORT : '3000';

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/weather', (req, res) => {
    try {
        const zip = req.body.zip;
        const apiKey = process.env.API_KEY;
        const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=metric`;

        const request = http.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const weatherData = JSON.parse(data);
                    res.render('weather/show', {
                        city: weatherData.name,
                        temperature: weatherData.main.temp,
                        description: weatherData.weather[0].description
                    });
                } catch (error) {
                    console.error(error);
                    res.status(500).send('Internal Server Error');
                }
            });
        });

        request.on('error', (error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
