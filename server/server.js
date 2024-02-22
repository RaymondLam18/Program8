// import express from 'express';
// import cors from 'cors';
// import { ChatOpenAI } from "@langchain/openai";
//
// const app = express();
// app.use(cors());
//
// const model = new ChatOpenAI({
//     azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
//     azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
//     azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
//     azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
// });
//
// async function getJoke() {
//     try {
//         const joke = await model.invoke("Tell me a Javascript joke!");
//         return joke.content;
//     } catch (error) {
//         console.error("Error fetching joke:", error);
//         throw error;
//     }
// }
//
// app.get('/joke', async (req, res) => {
//     try {
//         const joke = await getJoke();
//         res.json({ joke });
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
//
// app.use(express.json());
//
// app.post('/chat', async (req, res) => {
//     const { query } = req.body;
//     try {
//         const response = await model.invoke(query);
//         res.json({ response: response.content });
//     } catch (error) {
//         console.error("Error processing chat query:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
//
// const PORT = process.env.PORT || 8000;
//
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
//

import express from 'express';
import cors from 'cors';
import { ChatOpenAI } from "@langchain/openai";

const app = express();
app.use(cors());

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});

async function getAnimeRecommendation() {
    try {
        // Hier roepen we het model aan met een query over anime
        const recommendation = await model.invoke("Kun je me een leuke anime aanbevelen?");
        return recommendation.content;
    } catch (error) {
        console.error("Error fetching anime recommendation:", error);
        throw error;
    }
}

app.get('/anime/recommendation', async (req, res) => {
    try {
        const recommendation = await getAnimeRecommendation();
        res.json({ recommendation });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use(express.json());

app.post('/chat', async (req, res) => {
    const { query } = req.body;
    try {
        const response = await model.invoke(query);
        res.json({ response: response.content });
    } catch (error) {
        console.error("Error processing chat query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
