import express from "express";
import cors from 'cors';
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
let chatHistory = [
    ["system", "You are an anime expert."],
];

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await animeRecommendation(prompt, chatHistory);
        res.json(response.content);
    } catch (error) {
        console.error("Error processing chat query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function animeRecommendation(prompt, chatHistory) {
    const messages = [...chatHistory, ["human", prompt]];
    const response = await model.invoke(messages, {
        temperature: 0.0,
        maxTokens: 100,
    });
    chatHistory.push(["ai", response.content]);
    return response;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
