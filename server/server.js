import express from "express";
import cors from 'cors';
import fetch from 'node-fetch';
import { ChatOpenAI } from "@langchain/openai";
// import { ChatAnthropic } from "@langchain/anthropic";

const app = express();
const port = 8000;

app.use(cors()); // Enable CORS
app.use(express.json());

const model = new ChatOpenAI({
    temperature: 0.0,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});

// const model = new ChatAnthropic({
//     temperature: 0.0,
//     apiKey: process.env.ANTHROPIC_API_KEY,
// });


let chatHistory = [];

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await processChat(prompt);
        res.json(response.content);
    } catch (error) {
        console.error("Error processing chat query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function processChat(prompt) {
    const messages = [...chatHistory, ["system", "Your name is Bob and you are an anime expert."], ["human", prompt]];
    const response = await model.invoke(messages, {
        temperature: 0.0,
        maxTokens: 100,
    });

    chatHistory.push(["system", response.content]);

    try {
        if (prompt.toLowerCase().includes("anime")) {
            const animeResponse = await fetch("https://api.jikan.moe/v4/anime");
            const animeData = await animeResponse.json();

            const randomIndexes  = [];
            while (randomIndexes .length < 5) {
                const randomIndex = Math.floor(Math.random() * animeData.data.length);
                if (!randomIndexes .includes(randomIndex)) {
                    randomIndexes .push(randomIndex);
                }
            }

            const recommendations = randomIndexes .map(index => animeData.data[index].title);
            return { content: "\n\nHere are some anime recommendations: " + recommendations.join(", ") };
        } else {
            return { content: response.content };
        }
    } catch (error) {
        console.error("Error processing chat query:", error);
        return { content: "Er is een fout opgetreden bij het verwerken van de query." };
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
