import { html, render } from "https://unpkg.com/lit-html?module";

async function testx() {
  const pos = await new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  const appid = "6e6644f5775bc9020264ffb06173ba01";

  // current weather
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${appid}`
  );
  const res_json = await res.json();
  const weather = res_json.weather[0].description;
  const weather_icon_url = `http://openweathermap.org/img/w/${
    res_json.weather[0].icon
  }.png`;
  const temp_C = res_json.main.temp;

  render(
    html`
      <section id="weather">
        <img src=${weather_icon_url} />
        <h3>weather: ${weather}, ${temp_C}℃</h3>
      </section>
    `,
    document.body.querySelector("#weather_ph")
  );

  // weather forecast for 5 days (3-hour interval data)
  // const tResFor = await fetch(
  //   `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${appid}`
  // );
  // const resFor = await tResFor.json();
  // resFor.list.map(item => item.dt);
  // // next day morning
  // const weather = resFor.list;
  // const weather_icon_url = `http://openweathermap.org/img/w/${
  //   resFor.weather[0].icon
  // }.png`;
  // const temp_C = resFor.main.temp;
}
testx();
