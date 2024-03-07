// Haal chatgeschiedenis op uit localStorage als het bestaat, anders initialiseer een lege array
let chatHistory = JSON.parse(localStorage.getItem("myChatHistory")) || [];

function askQuestion() {
    const question = document.getElementById("question").value.trim(); // Trim input
    if (!question) return; // Do nothing if input is empty

    const chatContainer = document.getElementById("chat-container");
    const loadingDiv = document.getElementById("loading");
    const submitBtn = document.getElementById("submit-btn");

    // Disable submit button
    submitBtn.disabled = true;

    // Display user message in chat window
    displayMessage(question, true);

    // Show loading spinner
    loadingDiv.classList.remove("hidden");

    // Make POST request to server with chat history
    fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: question, chatHistory: chatHistory })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Display bot message in chat window
            displayMessage(data, false);

            // If question is related to anime, the bot message may contain anime recommendations
            if (question.toLowerCase().includes("anime")) {
                // Extract anime recommendations from bot message (assuming it's separated by '\n\n')
                const recommendations = data.content.split("\n\n").slice(1).join("\n\n");
                displayMessage(recommendations, false);
            }

            // Add bot message to chat history
            chatHistory.push(["ai", data]);

            // Save updated chat history to localStorage
            localStorage.setItem("myChatHistory", JSON.stringify(chatHistory));
        })
        .catch(error => {
            console.error("Error:", error);
            // Display error message in chat window
            displayMessage("Er is een fout opgetreden bij het verwerken van de vraag. Probeer het later opnieuw.", false);
        })
        .finally(() => {
            // Enable submit button
            submitBtn.disabled = false;

            // Hide loading spinner
            loadingDiv.classList.add("hidden");

            // Scroll to bottom of chat window
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // Clear input field
            document.getElementById("question").value = "";
        });
}

function displayMessage(message, isUser) {
    const chatContainer = document.getElementById("chat-container");
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.classList.add("message");

    if (isUser) {
        messageDiv.classList.add("user-message");
    }

    chatContainer.appendChild(messageDiv);
}

// Event listener to handle enter key press
document.getElementById("question").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        askQuestion();
    }
});
