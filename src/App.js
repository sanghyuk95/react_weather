import { useEffect, useState } from "react";
// import { Configuration, OpenAIApi } from "openai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faShirt, faSun, faCloud, faCloudRain, faToggleOff, faToggleOn, faSnowflake, faCloudBolt, faCloudSunRain, faSmog } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./App.css";

function App() {
  let [loca, setLoca] = useState("seoul");
  let [locaKR, setLocaKR] = useState("서울");
  let [weather, setWeather] = useState("");
  let [answer, setAnswer] = useState("");
  let [iconW, setIconW] = useState("");
  let [toggleIcon, setToggleIcon] = useState(faToggleOff);
  const weatherKey = "f990de359e75fb9bab0b5c647cdb7937";

  // const openAiKey = "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";

  // const configuration = new Configuration({
  //   apiKey: openAiKey,
  // });
  // const openai = new OpenAIApi(configuration);

  useEffect(() => {
    // 날씨api
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${loca}&lang=kr&appid=${weatherKey}&units=metric`)
      .then((result) => {
        setWeather(result.data);
        setIconW(result.data.weather[0].main);
      })
      .catch(() => {
        console.log("fail");
      });
  }, [loca]);
  useEffect(() => {
    if (weather) {
      let q =
        "https://react-weather-378703.df.r.appspot.com/translate?q=" +
        `now_weather:${iconW}/current_temperature:${weather.main.temp}c/sensory_temperature:${weather.main.feels_like}c/humidity:${weather.main.humidity}%/wind_speed:${weather.wind.speed}m/s//Recommend_three_clothes_for_each_body_part_according_to_the_weatherconditions`;
      axios.get(q).then((r) => {
        let result = JSON.parse(r.data).message.result.translatedText;
        setAnswer(result);
      });
    }
  }, [weather]);

  return (
    <div className={toggleIcon === faToggleOff ? "container" : "container dark"}>
      <div className={toggleIcon === faToggleOff ? "toggle-btn" : "toggle-btn dark"}>
        <p>다크모드</p>
        <FontAwesomeIcon
          icon={toggleIcon}
          className="toggle-btn-icon"
          onClick={() => {
            setToggleIcon(toggleIcon === faToggleOff ? faToggleOn : faToggleOff);
          }}
        />
      </div>
      <div className="wrapper">
        <div className="sidebar">
          <ul className="navi">
            <li>
              <a href="">
                <FontAwesomeIcon icon={faHouse} />
              </a>
            </li>
            <li>
              <a href="">
                <FontAwesomeIcon icon={faShirt} />
              </a>
            </li>
          </ul>
        </div>
        <div className="main">
          <div className="box">
            <div className={toggleIcon === faToggleOff ? "box-left" : "box-left dark"}>
              <select
                className="box-select"
                onChange={(e) => {
                  setLocaKR(e.target.options[e.target.selectedIndex].text);
                  setLoca(e.target.value);
                }}
                value={loca}
              >
                <option value="seoul">서울</option>
                <option value="busan">부산</option>
                <option value="incheon">인천</option>
                <option value="daegu">대구</option>
                <option value="daejeon">대전</option>
                <option value="gwangju">광주</option>
                <option value="ulsan">울산</option>
              </select>
              <div className={toggleIcon === faToggleOff ? "weather" : "weather dark"}>
                <div className="weather-icon">
                  <Icon iconW={iconW}></Icon>
                </div>
                <p className="weather-now">{weather ? `${locaKR}의 현재온도 : ${weather.main.temp}°C ` : "연결안됨"}</p>
                <p className="weather-now">{weather ? `현재습도 : ${weather.main.humidity}%` : "연결안됨"}</p>
                <p className="weather-now">{weather ? `풍속 : ${weather.wind.speed}m/s` : "연결안됨"}</p>
              </div>
            </div>
            <div className={toggleIcon === faToggleOff ? "box-right" : "box-right dark"}>
              <p>{answer ? answer : "기다리셈"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon(props) {
  if (props.iconW === "Clear") {
    return <FontAwesomeIcon icon={faSun} />;
  }
  if (props.iconW === "Clouds") {
    return <FontAwesomeIcon icon={faCloud} />;
  }
  if (props.iconW === "Rain") {
    return <FontAwesomeIcon icon={faCloudRain} />;
  }
  if (props.iconW === "Snow") {
    return <FontAwesomeIcon icon={faSnowflake} />;
  }
  if (props.iconW === "Thunderstorm") {
    return <FontAwesomeIcon icon={faCloudBolt} />;
  }
  if (props.iconW === "Drizzle") {
    return <FontAwesomeIcon icon={faSmog} />;
  }
  <FontAwesomeIcon icon={faCloudSunRain} />;
}
export default App;
