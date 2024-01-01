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

  const tempDiv = document.createElement("div");
  tempDiv.classList.add("switch-temperature");
  const tempCel = document.createElement("p");
  tempCel.innerText = `${current.temp_c}`;
  tempCel.classList.add("celsius");
  tempDiv.appendChild(tempCel);

  const tempFar = document.createElement("p");
  tempFar.innerText = `${current.temp_f}`;
  tempFar.classList.add("fahrenheit");
  tempDiv.appendChild(tempFar);

  const celBtn = document.createElement("button");
  const farBtn = document.createElement("button");

  celBtn.innerText = "°C";
  celBtn.addEventListener("click", () => {
    celBtn.classList.add("active");
    farBtn.classList.remove("active");
    const fahrenheitTemps = document.querySelectorAll(".fahrenheit");
    fahrenheitTemps.forEach((temp) => {
      temp.classList.add("hidden");
    });
    const celsiusTemps = document.querySelectorAll(".celsius");
    celsiusTemps.forEach((temp) => {
      temp.classList.remove("hidden");
    });
  });
  tempDiv.appendChild(celBtn);

  farBtn.innerText = "°F";
  farBtn.addEventListener("click", () => {
    celBtn.classList.remove("active");
    farBtn.classList.add("active");
    const celsiusTemps = document.querySelectorAll(".celsius");
    celsiusTemps.forEach((temp) => {
      temp.classList.add("hidden");
    });
    const fahrenheitTemps = document.querySelectorAll(".fahrenheit");
    fahrenheitTemps.forEach((temp) => {
      temp.classList.remove("hidden");
    });
  });
  tempDiv.appendChild(farBtn);

  div.appendChild(tempDiv);

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

  const form = document.createElement("form");
  form.id = "weather-location";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newLocation = formData.get("location");
    const weatherData = await getWeather(newLocation);
    if (weatherData) {
      container.innerHTML = null;
      const {
        location: locationData,
        current,
        forecast: { forecastday },
      } = weatherData;
      container.appendChild(displayLocation(locationData));
      container.appendChild(displayCurrentWeather(current));
      container.appendChild(displayForecast(forecastday));
    }
  });
  const input = document.createElement("input");
  input.name = "location";
  form.appendChild(input);
  const button = document.createElement("button");
  button.innerText = "Change location";
  form.appendChild(button);
  div.appendChild(form);

  const location = document.createElement("p");
  location.innerText = `${name}, ${country}`;
  div.appendChild(location);

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
