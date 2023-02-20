import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faShirt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./App.css";

function App() {
  let [loca, setLoca] = useState("daegu");
  let [weather, setWeather] = useState("");
  let [answer, setAnswer] = useState("");
  const weatherKey = "f990de359e75fb9bab0b5c647cdb7937";
  const openAiKey = "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";

  const configuration = new Configuration({
    apiKey: openAiKey,
  });
  const openai = new OpenAIApi(configuration);

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
            <button
              onClick={() => {
                //날씨api
                axios
                  .get(`https://api.openweathermap.org/data/2.5/weather?q=${loca}&lang=kr&appid=${weatherKey}&units=metric`)
                  .then((result) => {
                    setWeather(result.data);
                    console.log(weather.weather[0].main);
                  })
                  .catch(() => {
                    console.log("fail");
                  });
              }}
            >
              현재 온도현재온도
            </button>
            <div>{weather ? `${loca}의 현재온도 : ${weather.main.temp} °C` : "연결안됨 ㅠㅠ"}</div>
            <button
              onClick={() => {
                // ai api
                openai
                  .createCompletion({
                    model: "text-davinci-003",
                    prompt: `
              now weather : ${weather.weather[0].main}
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
            >
              오늘 날씨에 따른 옷 추천
            </button>
            <div>{answer ? answer : "기다리셈"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
