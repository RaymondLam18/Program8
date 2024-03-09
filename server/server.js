// Importeer de nodige modules
import express from "express"; // Express.js framework voor het bouwen van webapplicaties
import cors from 'cors'; // Middleware voor het instellen van CORS headers
import fetch from 'node-fetch'; // Voor het uitvoeren van HTTP-verzoeken vanuit Node.js
import { ChatOpenAI } from "@langchain/openai"; // Importeer de ChatOpenAI klasse van het @langchain/openai pakket

// Initialiseer Express app
const app = express();
const port = 8000; // De poort waarop de server draait

// Middleware voor het inschakelen van CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Middleware voor het parsen van JSON body's
app.use(express.json());

// Initialiseer het ChatOpenAI model met de juiste configuratie
const model = new ChatOpenAI({
    temperature: 0.0, // Temperatuurinstelling voor het genereren van responsen
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // API-sleutel voor OpenAI vanuit de omgevingsvariabelen
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION, // API-versie van OpenAI vanuit de omgevingsvariabelen
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME, // Instantienaam voor OpenAI vanuit de omgevingsvariabelen
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME, // Implementatienaam voor OpenAI vanuit de omgevingsvariabelen
});

// Endpoint voor het verwerken van chatverzoeken
app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body.prompt; // Haal de chatprompt op uit de ontvangen request
        const response = await processChat(prompt); // Verwerk de chatprompt
        res.json(response.content); // Stuur het resultaat terug als JSON
    } catch (error) {
        console.error("Error processing chat query:", error); // Log eventuele fouten
        res.status(500).json({ error: "Internal Server Error" }); // Stuur een 500 foutcode terug bij fouten
    }
});

// Functie voor het verwerken van chatberichten
async function processChat(prompt) {
    const messages = [...chatHistory, ["system", "You name is Bob and you are an anime expert."], ["human", prompt]]; // Combineer chatgeschiedenis met de huidige prompt
    const response = await model.invoke(messages, {
        temperature: 0.0, // Temperatuurinstelling voor het genereren van responsen
        maxTokens: 100, // Maximaal aantal tokens voor de gegenereerde respons
    });

    chatHistory.push(["system", response.content]); // Voeg de gegenereerde respons toe aan de chatgeschiedenis

    try {
        if (prompt.toLowerCase().includes("anime")) { // Controleer of de prompt "anime" bevat
            const animeResponse = await fetch("https://api.jikan.moe/v4/anime"); // Haal gegevens op van een anime API
            const animeData = await animeResponse.json(); // Converteer de response naar JSON
            const recommendations = animeData.data.slice(0, 5).map(anime => anime.title); // Selecteer en map aanbevolen anime
            return { content: response.content + "\n\nHier zijn enkele aanbevolen anime: " + recommendations.join(", ") }; // Voeg aanbevolen anime toe aan de gegenereerde respons
        } else {
            return { content: response.content }; // Stuur alleen de gegenereerde respons terug
        }
    } catch (error) {
        console.error("Error processing chat query:", error); // Log eventuele fouten
        return { content: "Er is een fout opgetreden bij het verwerken van de chatquery." }; // Geef een foutmelding terug bij fouten
    }
}

// Start de server op de gespecificeerde poort
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
