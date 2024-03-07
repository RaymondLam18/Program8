import express from "express";
import cors from 'cors';
import fetch from 'node-fetch';
import { ChatOpenAI } from "@langchain/openai";

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

// Initialize chat history
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
    const messages = [...chatHistory, ["system", "You are an anime expert."], ["human", prompt]];
    const response = await model.invoke(messages, {
        temperature: 0.0,
        maxTokens: 100,
    });

    chatHistory.push(["system", response.content]);

    try {
        if (prompt.toLowerCase().includes("anime")) {
            const animeResponse = await fetch("https://api.jikan.moe/v4/anime");
            const animeData = await animeResponse.json();
            const recommendations = animeData.data.slice(0, 5).map(anime => anime.title);
            return { content: response.content + "\n\nHier zijn enkele aanbevolen anime: " + recommendations.join(", ") };
        } else {
            return { content: response.content };
        }
    } catch (error) {
        console.error("Error processing chat query:", error);
        return { content: "Er is een fout opgetreden bij het verwerken van de chatquery." };
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
