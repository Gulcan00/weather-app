const WEATHER_API_KEY = "514393f917194c5789a112205232112";
const GIPHY_API_KEY = "UYttXGZ5FsNnFbHuMlCHb8YTjrIx80zN";

const url = `https://api.weatherapi.com/v1/forecast.json?q=London&days=3&key=${WEATHER_API_KEY}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data));
