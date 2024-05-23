const express=require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const { Configuration, OpenAIApi } = require('openai');
const router = express.Router()

// Setup server
const config = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  baseUrl: 'https://api.openai.com/v1/chat/completion',
  dangerouslyAllowBrowser: true,
})

const openai = new OpenAIApi(config)

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  withCredentials: true,
}));


// endpoint for ChatGPT

app.post("https://api.openai.com/v1/chat/completion",async (req, res) => {
  const { prompt } = req.body;
  
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 512,
    temperature: 0,
    prompt: prompt,
  });
  res.send(completion.data.choices[0].text);
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

//run node server.js