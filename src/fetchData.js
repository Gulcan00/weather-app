const WEATHER_API_KEY = "514393f917194c5789a112205232112";
const GIPHY_API_KEY = "UYttXGZ5FsNnFbHuMlCHb8YTjrIx80zN";

export function getWeather(location = "Nicosia") {
  const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?q=${location}&days=3&key=${WEATHER_API_KEY}`;
  return fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Not found");
      }
      return response.json();
    })
    .catch((e) => console.log(e));
}

export async function getGif(query) {
  fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${query}`
  ).then((response) => response.json());
}
