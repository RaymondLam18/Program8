function askQuestion() {
    const question = document.getElementById("question").value;
    const chatContainer = document.getElementById("chat-container");
    const loadingDiv = document.getElementById("loading");
    const submitBtn = document.getElementById("submit-btn");

    // Disable submit button
    submitBtn.disabled = true;

    // Display user message in chat window
    displayMessage(question, true);

    // Show loading spinner
    loadingDiv.classList.remove("hidden");

    // Make POST request to server
    fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: question })
    })
        .then(response => response.json())
        .then(data => {
            // Display bot message in chat window
            displayMessage(data, false);

            // Enable submit button
            submitBtn.disabled = false;

            // Hide loading spinner
            loadingDiv.classList.add("hidden");

            // Scroll to bottom of chat window
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(error => {
            console.error("Error:", error);
            // Display error message in chat window
            displayMessage("Er is een fout opgetreden bij het verwerken van de vraag. Probeer het later opnieuw.", false);

            // Enable submit button
            submitBtn.disabled = false;

            // Hide loading spinner
            loadingDiv.classList.add("hidden");

            // Scroll to bottom of chat window
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });

    // Clear input field
    document.getElementById("question").value = "";
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
