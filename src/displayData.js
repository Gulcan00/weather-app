import { getWeather } from "./fetchData";

function displayForecast(forecast) {
  const div = document.createElement("div");
  div.classList.add("forecast");
  forecast.forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("forecastDay");
    const dateP = document.createElement("p");
    const date = new Date(day.date);
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    dateP.innerText = weekday[date.getDay()];
    dayDiv.appendChild(dateP);

    const icon = document.createElement("img");
    icon.src = day.day.condition.icon;
    icon.title = day.day.condition.text;
    dayDiv.appendChild(icon);

    const tempCel = document.createElement("p");
    tempCel.innerText = `${day.day.avgtemp_c}°C`;
    tempCel.classList.add("celsius");
    dayDiv.appendChild(tempCel);

    const tempFah = document.createElement("p");
    tempFah.innerText = `${day.day.avgtemp_f}°F`;
    tempFah.classList.add("fahrenheit", "hidden");
    dayDiv.appendChild(tempFah);

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
  tempDiv.classList.add("temperatureContainer");
  const tempCel = document.createElement("p");
  tempCel.innerText = `${current.temp_c}`;
  tempCel.classList.add("celsius", "currentTemp");
  tempDiv.appendChild(tempCel);

  const tempFar = document.createElement("p");
  tempFar.innerText = `${current.temp_f}`;
  tempFar.classList.add("fahrenheit", "hidden", "currentTemp");
  tempDiv.appendChild(tempFar);

  const celBtn = document.createElement("button");
  const farBtn = document.createElement("button");

  celBtn.innerText = "°C";
  celBtn.classList.add("active");
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

  const condition = document.createElement("p");
  condition.innerText = current.condition.text;
  div.appendChild(condition);

  const humidity = document.createElement("p");
  humidity.innerText = `Humidity: ${current.humidity}%`;
  div.appendChild(humidity);

  const wind = document.createElement("p");
  wind.innerText = `Wind: ${current.wind_kph} km/h`;
  div.appendChild(wind);

  return div;
}

function displayLocation({ country, localtime, name }) {
  const container = document.getElementById("container");
  const div = document.createElement("div");
  div.classList.add("location");

  const form = document.createElement("form");
  form.id = "weather-location";
  const input = document.createElement("input");
  input.name = "location";
  form.appendChild(input);
  const span = document.createElement("span");
  form.appendChild(span);
  const button = document.createElement("button");
  button.innerText = "Change location";
  form.appendChild(button);
  div.appendChild(form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newLocation = formData.get("location");

    const loadingGif = document.createElement("img");
    loadingGif.classList.add("loadingGif");
    loadingGif.src =
      "https://media1.giphy.com/media/11ASZtb7vdJagM/giphy.gif?cid=42c22243ltbp7yuptzirwjswr6cju3y7yvkxbg0u516s6h8v&ep=v1_gifs_translate&rid=giphy.gif&ct=g";
    container.appendChild(loadingGif);
    const weatherData = await getWeather(newLocation);
    loadingGif.style.display = "none";
    if (weatherData) {
      span.innerText = "";
      container.innerHTML = null;
      const {
        location: locationData,
        current,
        forecast: { forecastday },
      } = weatherData;
      container.appendChild(displayLocation(locationData));
      container.appendChild(displayCurrentWeather(current));
      container.appendChild(displayForecast(forecastday));
    } else {
      span.innerText = "Location not found";
    }
  });

  const location = document.createElement("p");
  location.innerText = `${name}, ${country}`;
  div.appendChild(location);

  const dateObj = new Date(localtime);
  const date = document.createElement("p");
  date.innerText = `${dateObj.getDay().toString().padStart(2, "0")}/${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(
      2,
      "0"
    )}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
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
