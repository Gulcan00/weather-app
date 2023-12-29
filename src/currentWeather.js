const GIPHY_API_KEY = "UYttXGZ5FsNnFbHuMlCHb8YTjrIx80zN";

function addGif(url) {
  const container = document.querySelector("#container");
  const gif = document.createElement("img");
  gif.src = url;
  container.appendChild(gif);
}

export default function displayCurrentWeather(current) {
  fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${current.condition.text}`
  )
    .then((response) => response.json())
    .then((data) => addGif(data.data.images.original.url));
}
