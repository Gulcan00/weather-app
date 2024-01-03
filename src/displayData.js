import { format } from "date-fns";
import { getWeather } from "./fetchData";

function displayForecast(forecast) {
  const div = document.createElement("div");
  div.classList.add("forecast");
  forecast.forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("forecastDay");
    const dateP = document.createElement("p");
    const date = new Date(day.date);
    dateP.innerText = format(date, "eeee");
    dayDiv.appendChild(dateP);

    const icon = document.createElement("img");
    icon.src = day.day.condition.icon;
    icon.title = day.day.condition.text;
    icon.height = 80;
    icon.width = 80;
    dayDiv.appendChild(icon);

    const temperature = document.createElement("div");
    temperature.classList.add("forecastTemperature");

    const celMax = document.createElement("p");
    celMax.innerText = `${day.day.maxtemp_c}°C`;
    celMax.classList.add("celsius");
    temperature.appendChild(celMax);

    const celMin = document.createElement("p");
    celMin.style.color = "#d1d5db";
    celMin.innerText = `${day.day.mintemp_c}°C`;
    celMin.classList.add("celsius");
    temperature.appendChild(celMin);

    const fahMax = document.createElement("p");
    fahMax.innerText = `${day.day.maxtemp_f}°F`;
    fahMax.classList.add("fahrenheit", "hidden");
    temperature.appendChild(fahMax);

    const fahMin = document.createElement("p");
    fahMin.style.color = "#d1d5db";
    fahMin.innerText = `${day.day.mintemp_f}°F`;
    fahMin.classList.add("fahrenheit", "hidden");
    temperature.appendChild(fahMin);

    dayDiv.appendChild(temperature);
    div.appendChild(dayDiv);
  });
  return div;
}

function displayCurrentWeather(current) {
  const currentDiv = document.createElement("div");
  currentDiv.classList.add("current");

  const div = document.createElement("div");

  const tempAndIcon = document.createElement("div");
  tempAndIcon.style.display = "flex";
  tempAndIcon.style.gap = "8px";
  tempAndIcon.style.alignItems = "center";

  const icon = document.createElement("img");
  icon.src = current.condition.icon;
  icon.height = 100;
  icon.width = 100;
  tempAndIcon.appendChild(icon);

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

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.alignItems = "center";
  btnContainer.style.alignSelf = "flex-start";

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
  btnContainer.appendChild(celBtn);

  const line = document.createElement("div");
  line.style.borderLeft = "3px solid var(--feldgrau)";
  line.style.height = "25px";
  btnContainer.appendChild(line);

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
  btnContainer.appendChild(farBtn);
  tempDiv.appendChild(btnContainer);

  tempAndIcon.appendChild(tempDiv);
  div.appendChild(tempAndIcon);

  const condition = document.createElement("p");
  condition.style.fontSize = "1.6rem";
  condition.style.margin = 0;
  condition.innerText = current.condition.text;
  div.appendChild(condition);
  currentDiv.appendChild(div);

  const details = document.createElement("div");
  details.style.marginTop = "6px";
  const humidity = document.createElement("p");
  humidity.innerText = `Humidity: ${current.humidity}%`;
  details.appendChild(humidity);

  const wind = document.createElement("p");
  wind.innerText = `Wind: ${current.wind_kph} km/h`;
  details.appendChild(wind);

  const cloud = document.createElement("p");
  cloud.innerText = `Cloud: ${current.cloud}%`;
  details.appendChild(cloud);
  currentDiv.appendChild(details);

  return currentDiv;
}

function displayLocation({ country, localtime, name }) {
  const container = document.getElementById("container");
  const div = document.createElement("div");
  div.classList.add("location");

  const form = document.createElement("form");
  form.id = "weather-location";
  const input = document.createElement("input");
  input.name = "location";
  input.required = true;
  form.appendChild(input);
  const button = document.createElement("button");
  button.innerText = "Search";
  form.appendChild(button);
  const span = document.createElement("span");
  form.appendChild(span);
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
      input.classList.add("error");
      span.innerText = "Location not found";
    }
  });

  const location = document.createElement("p");
  location.innerText = `${name}, ${country}`;
  div.appendChild(location);

  const dateObj = new Date(localtime);
  const date = document.createElement("p");
  date.innerText = `${format(dateObj, "eeee, d MMMM, yyyy")}
    ${format(dateObj, "HH:mm a")}`;
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
