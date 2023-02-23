let express = require("express");
let app = express();
let request = require("request");
let { OpenAIApi, Configuration } = require("openai");
const path = require("path");
app.use(express.static(path.join(__dirname, "/build")));

let config = new Configuration({
  apiKey: "app_key",
});
let openai = new OpenAIApi(config);

let client_id = "VnC5y8uRnb5Y6OI2cyW9";
let client_secret = "oXCUrqNCu9";

app.get("/test", function (req, res) {
  res.json("dddd");
});

app.get("/translate", function (req, res) {
  let query = req.query.q;
  console.log(`질문 : ${query}`);

  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: query,
      temperature: 0.7,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((result) => {
      console.log("ai 응답", result.data.choices[0].text);

      //번역
      let api_url = "https://openapi.naver.com/v1/papago/n2mt";
      let query = result.data.choices[0].text;
      let options = {
        url: api_url,
        form: { source: "en", target: "ko", text: query },
        headers: { "X-Naver-Client-Id": client_id, "X-Naver-Client-Secret": client_secret },
      };
      request.post(options, function (error, response, body) {
        console.log(body);
        res.status(200).json(body);
      });
    })
    .catch(() => {
      console.log("openai error");
    });
});

// 안되는듯? 다시 해야댐
app.get("/index", function (req, res) {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(8080, function () {
  console.log("http://localhost:8080/ app listening on port 8080!");
});
