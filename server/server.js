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

let chatHistory = []; // Initialize chat history array

app.post("/chat", async (req, res) => {
    try {
        const response = await processChat(req.body.prompt);
        res.json(response.content);
    } catch (error) {
        console.error("Error processing chat query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function processChat(prompt) {
    // Add user prompt to chat history
    chatHistory.push(["human", prompt]);

    // Invoke the model with chat history
    const response = await model.invoke(chatHistory, {
        temperature: 0.0,
        maxTokens: 100,
    });

    // Add AI response to chat history
    chatHistory.push(["ai", response.content]);

    return response;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
