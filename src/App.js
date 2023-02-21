import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faShirt, faSun, faCloud, faCloudRain } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./App.css";

function App() {
  let [loca, setLoca] = useState("seoul");
  let [weather, setWeather] = useState("");
  let [answer, setAnswer] = useState("");
  let [iconW, setIconW] = useState("");
  const weatherKey = "f990de359e75fb9bab0b5c647cdb7937";
  const openAiKey = "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";

  const configuration = new Configuration({
    apiKey: openAiKey,
  });
  const openai = new OpenAIApi(configuration);

  useEffect(() => {
    // 날씨api
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${loca}&lang=kr&appid=${weatherKey}&units=metric`)
      .then((result) => {
        setWeather(result.data);
        console.log(result.data);
        setIconW(result.data.weather[0].main);
      })
      .catch(() => {
        console.log("fail");
      });
  }, [loca]);

  return (
    <div className="container">
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
            <div className="box-left">
              <select
                className="box-select"
                onChange={(e) => {
                  setLoca(e.target.value);
                  // ai api
                  openai
                    .createCompletion({
                      model: "text-davinci-003",
                      prompt: `
              now weather : ${iconW}
              current temperature : ${weather.main.temp}
              sensory temperature : ${weather.main.feels_like}
              humidity : ${weather.main.humidity}
              wind speed : ${weather.wind.speed}
              recommend clothes
              `,
                      temperature: 0.7,
                      max_tokens: 256,
                      top_p: 1,
                      frequency_penalty: 0,
                      presence_penalty: 0,
                    })
                    .then((result) => {
                      setAnswer(result.data.choices[0].text);
                    });
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
              <div className="weather">
                <div className="weather-icon">
                  <Icon iconW={iconW}></Icon>
                </div>
                <p className="weather-now">{weather ? `${loca}의 현재온도 : ${weather.main.temp}°C ` : "연결안됨"}</p>
                <p className="weather-now">{weather ? `현재습도 : ${weather.main.humidity}%` : "연결안됨"}</p>
                <p className="weather-now">{weather ? `풍속 : ${weather.wind.speed}m/s` : "연결안됨"}</p>
              </div>
            </div>
            <div className="box-right">
              <div>{answer ? answer : "기다리셈"}</div>
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
  if (props.iconW === "Cloud") {
    return <FontAwesomeIcon icon={faCloud} />;
  }
  if (props.iconW === "Rain") {
    return <FontAwesomeIcon icon={faCloudRain} />;
  }
}
export default App;
