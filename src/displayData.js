import { getWeather } from "./fetchData";

function displayForecast(forecast) {
  const div = document.createElement("div");
  div.classList.add("forecast");
  forecast.forEach((day) => {
    const dayDiv = document.createElement("div");
    const date = document.createElement("p");
    date.innerText = day.date;
    dayDiv.appendChild(date);
    div.appendChild(dayDiv);
  });
  return div;
}

function displayCurrentWeather(current) {
  const div = document.createElement("div");
  div.classList.add("current");

  const icon = document.createElement("img");
  icon.src = current.condition.icon;
  div.appendChild(icon);

  const temp = document.createElement("p");
  temp.innerText = `${current.temp_c}°C`;
  div.appendChild(temp);

  const humidity = document.createElement("p");
  humidity.innerText = `${current.humidity}%`;
  div.appendChild(humidity);

  const wind = document.createElement("p");
  wind.innerText = `${current.wind_kph} km/h`;
  div.appendChild(wind);

  return div;
}

function displayLocation({ country, localtime, name }) {
  const container = document.getElementById("container");
  const div = document.createElement("div");
  div.classList.add("location");

  const location = document.createElement("p");
  location.innerText = `${name}, ${country}`;
  div.appendChild(location);

  const form = document.createElement("form");
  form.id = "weather-location";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newLocation = formData.get("location");
    const weatherData = await getWeather(newLocation);
    if (weatherData) {
      container.innerHTML = null;
      const { location: locationData, current, forecast } = weatherData;
      container.appendChild(displayLocation(locationData));
      container.appendChild(displayCurrentWeather(current));
    }
  });
  const input = document.createElement("input");
  input.name = "location";
  form.appendChild(input);
  const button = document.createElement("button");
  button.innerText = "Change location";
  form.appendChild(button);
  div.appendChild(form);

  const dateObj = new Date(localtime);
  const date = document.createElement("p");
  date.innerText = dateObj.toDateString();
  div.appendChild(date);

  return div;
}

export default async function displayWeather() {
  const {
    location,
    current,
    forecast: { forecastday },
  } = await getWeather();
  console.log(current);
  console.log(forecastday);
  const container = document.getElementById("container");
  container.appendChild(displayLocation(location));
  container.appendChild(displayCurrentWeather(current));
  container.appendChild(displayForecast(forecastday));
}
