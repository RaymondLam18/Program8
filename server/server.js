// import express from "express";
// import cors from 'cors';
// import fetch from 'node-fetch'; // Import fetch for making HTTP requests
// import { ChatOpenAI } from "@langchain/openai";
//
// const app = express();
// const port = 8000;
//
// app.use(cors()); // Enable CORS
// app.use(express.json());
//
// const model = new ChatOpenAI({
//     temperature: 0.0,
//     azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
//     azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
//     azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
//     azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
// });
//
// // Initialize chat history
// let chatHistory = [
//     ["system", "You are an anime expert."],
// ];
//
// app.post("/chat", async (req, res) => {
//     try {
//         const prompt = req.body.prompt;
//         const response = await animeRecommendation(prompt, chatHistory);
//         res.json(response.content);
//     } catch (error) {
//         console.error("Error processing chat query:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
//
// async function animeRecommendation(prompt, chatHistory) {
//     const messages = [...chatHistory, ["human", prompt]];
//     const response = await model.invoke(messages, {
//         temperature: 0.0,
//         maxTokens: 100,
//     });
//     chatHistory.push(["ai", response.content]);
//     return response;
// }
//
// app.get("/anime", async (req, res) => {
//     try {
//         const animeData = await fetch("https://api.jikan.moe/v4/anime");
//         const animeJson = await animeData.json();
//         res.json(animeJson);
//     } catch (error) {
//         console.error("Error fetching anime data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
//
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


// import express from "express";
// import cors from 'cors';
// import fetch from 'node-fetch'
// import { ChatOpenAI } from "@langchain/openai";
//
// const app = express();
// const port = 8000;
//
// app.use(cors()); // Enable CORS
// app.use(express.json());
//
// const model = new ChatOpenAI({
//     temperature: 0.0,
//     azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
//     azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
//     azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
//     azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
// });
//
// // Initialize chat history
// let chatHistory = [
//     ["system", "You are an anime expert."],
// ];
//
// app.post("/chat", async (req, res) => {
//     try {
//         const prompt = req.body.prompt;
//         const response = await animeRecommendation(prompt, chatHistory);
//         res.json(response.content);
//     } catch (error) {
//         console.error("Error processing chat query:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
//
// async function animeRecommendation(prompt, chatHistory) {
//     const messages = [...chatHistory, ["human", prompt]];
//     const response = await model.invoke(messages, {
//         temperature: 0.0,
//         maxTokens: 100,
//     });
//
//     try {
//         // Fetch anime data from Jikan API
//         const animeData = await fetch(`https://api.jikan.moe/v4/search/anime?q=${prompt}`);
//
//         if (!animeData.ok) {
//             throw new Error("Failed to fetch anime data from Jikan API");
//         }
//
//         const animeJson = await animeData.json();
//         const animeRecommendation = animeJson.results[0]; // Assuming you want the first result
//
//         const recommendationMessage = `I recommend you watch "${animeRecommendation.title}"!`;
//
//         // Push AI response to chat history
//         chatHistory.push(["ai", recommendationMessage]);
//
//         return recommendationMessage;
//     } catch (error) {
//         console.error("Error fetching anime data from Jikan API:", error);
//         throw error;
//     }
// }
//
//
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

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
let chatHistory = [
    ["system", "You are an anime expert."],
];

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
    if (prompt.toLowerCase().includes("anime")) {
        return await handleAnimeQuestion(prompt);
    } else {
        return await defaultChat(prompt);
    }
}

async function handleAnimeQuestion(prompt) {
    const messages = [...chatHistory, ["human", prompt]];
    const response = await model.invoke(messages, {
        temperature: 0.0,
        maxTokens: 100,
    });

    try {
        const animeResponse = await fetch("https://api.jikan.moe/v4/anime");
        const animeData = await animeResponse.json();

        const recommendations = animeData.anime.slice(0, 5).map(anime => anime.title);

        chatHistory.push(["ai", response.content]);
        return { content: response.content + "\n\nHier zijn enkele aanbevolen anime: " + recommendations.join(", ") };
    } catch (error) {
        console.error("Error fetching anime data:", error);
        return { content: response.content + "\n\nEr is een fout opgetreden bij het ophalen van anime-aanbevelingen." };
    }
}


async function defaultChat(prompt) {
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
