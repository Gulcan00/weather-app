import { getWeather } from "./fetchData";

function displayLocation({ country, localtime, name }) {
  const div = document.createElement("div");
  div.classList.add("location");

  const location = document.createElement("p");
  location.innerText = `${name}, ${country}`;
  div.appendChild(location);

  const button = document.createElement("button");
  button.innerText = "Change location";
  const input = document.createElement("input");

  const dateObj = new Date(localtime);
  const date = document.createElement("p");
  date.innerText = dateObj.toDateString();
  div.appendChild(date);

  return div;
}

function displayCurrentWeather(current) {}

export default async function displayWeather() {
  const { location, current, forecast } = await getWeather();
  console.log(current);
  console.log(forecast);
  const container = document.getElementById("container");
  container.appendChild(displayLocation(location));
}
