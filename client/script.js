let chatHistory = JSON.parse(localStorage.getItem("myChatHistory")) || []; // Haal chatgeschiedenis op uit lokale opslag, als deze niet bestaat, maak een lege array aan

// Functie voor het stellen van een vraag
function askQuestion() {
    const question = document.getElementById("question").value.trim(); // Haal de ingevoerde vraag op en verwijder eventuele voorloopje of nasleepse witruimte
    if (!question) return; // Als er geen vraag is, stop de functie

    // Haal de nodige DOM-elementen op
    const chatContainer = document.getElementById("chat-container");
    const loadingDiv = document.getElementById("loading");
    const submitBtn = document.getElementById("submit-btn");
    const questionInput = document.getElementById("question");

    submitBtn.disabled = true; // Schakel de verzendknop uit

    questionInput.removeEventListener("keypress", handleEnterKeyPress); // Verwijder het keypress event listener van het vraag invoerveld

    questionInput.disabled = true; // Schakel het vraag invoerveld uit

    displayMessage(question, true); // Toon de vraag in de chatgeschiedenis als gebruikersbericht

    loadingDiv.classList.remove("hidden"); // Verwijder de "hidden" klasse van het laadicoon om het zichtbaar te maken

    // Stuur een HTTP-verzoek naar de server voor het verwerken van de vraag
    fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: question, chatHistory: chatHistory }) // Stuur de vraag en de chatgeschiedenis naar de server
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok"); // Gooi een fout als het HTTP-verzoek niet succesvol is
            }
            return response.json(); // Converteer de response naar JSON
        })
        .then(data => {
            displayMessage(data, false); // Toon het antwoord van de server in de chatgeschiedenis

            if (question.toLowerCase().includes("anime")) { // Als de vraag het woord "anime" bevat
                const recommendations = data.content.split("\n\n").slice(1).join("\n\n"); // Haal aanbevolen anime op uit het antwoord
                displayMessage(recommendations, false); // Toon aanbevolen anime in de chatgeschiedenis
            }

            chatHistory.push(["system", data]); // Voeg het antwoord van de server toe aan de chatgeschiedenis

            localStorage.setItem("myChatHistory", JSON.stringify(chatHistory)); // Sla de bijgewerkte chatgeschiedenis op in de lokale opslag
        })
        .catch(error => {
            console.error("Error:", error); // Log eventuele fouten naar de console
            displayMessage("Er is een fout opgetreden bij het verwerken van de vraag. Probeer het later opnieuw.", false); // Toon een foutmelding in de chatgeschiedenis
        })
        .finally(() => {
            submitBtn.disabled = false; // Schakel de verzendknop weer in

            questionInput.addEventListener("keypress", handleEnterKeyPress); // Voeg het keypress event listener weer toe aan het invoerveld

            questionInput.disabled = false; // Schakel het invoerveld weer in

            loadingDiv.classList.add("hidden"); // Voeg de "hidden" klasse weer toe aan het laadicoon om het te verbergen

            chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll naar beneden in de chatcontainer

            questionInput.value = ""; // Maak de inhoud van het vraag invoerveld leeg
        });
}

// Functie voor het weergeven van berichten in de chatgeschiedenis
function displayMessage(message, isUser) {
    const chatContainer = document.getElementById("chat-container"); // Haal de chatcontainer op
    const messageDiv = document.createElement("div"); // Maak een nieuw div-element aan voor het bericht
    messageDiv.textContent = message; // Voeg de tekst van het bericht toe aan het div-element
    messageDiv.classList.add("message"); // Voeg de "message" klasse toe aan het div-element

    if (isUser) {
        messageDiv.classList.add("user-message"); // Als het bericht van de gebruiker is, voeg de "user-message" klasse toe aan het div-element
    }

    chatContainer.prepend(messageDiv); // Voeg het bericht toe aan het begin van de chatcontainer
}

// Event listener voor het keypress event op het invoerveld
function handleEnterKeyPress(event) {
    if (event.key === "Enter") { // Als de ingedrukte toets "Enter" is
        event.preventDefault(); // Voorkom standaardgedrag van het invoerveld (voorkom dat er een nieuwe regel wordt toegevoegd)
        askQuestion(); // Stel de vraag
    }
}

// Voeg een event listener toe voor het keypress event op het invoerveld
document.getElementById("question").addEventListener("keypress", handleEnterKeyPress);
