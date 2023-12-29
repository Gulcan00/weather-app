import displayCurrentWeather from "./currentWeather";

const WEATHER_API_KEY = "514393f917194c5789a112205232112";

const url = `https://api.weatherapi.com/v1/forecast.json?q=London&days=3&key=${WEATHER_API_KEY}`;

async function initialFetch() {
  const weatherData = await fetch(url)
    .then((response) => response.json())
    .then((data) => data);

  displayCurrentWeather(weatherData.current);
}

initialFetch();
