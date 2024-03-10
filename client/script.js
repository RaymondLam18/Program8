let chatHistory = JSON.parse(localStorage.getItem("myChatHistory")) || [];

function askQuestion() {
    const question = document.getElementById("question").value.trim();
    if (!question) return;

    const chatContainer = document.getElementById("chat-container");
    const loadingDiv = document.getElementById("loading");
    const submitBtn = document.getElementById("submit-btn");
    const questionInput = document.getElementById("question");

    submitBtn.disabled = true;

    questionInput.removeEventListener("keypress", handleEnterKeyPress);

    questionInput.disabled = true;

    displayMessage(question, true);

    loadingDiv.classList.remove("hidden");

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
            displayMessage(data, false);

            if (question.toLowerCase().includes("anime")) {
                const recommendations = data.content.split("\n\n").slice(1).join("\n\n");
                displayMessage(recommendations, false);
            }

            chatHistory.push(["system", data]);

            localStorage.setItem("myChatHistory", JSON.stringify(chatHistory));
        })
        .catch(error => {
            console.error("Error:", error);
        })
        .finally(() => {
            submitBtn.disabled = false;

            questionInput.addEventListener("keypress", handleEnterKeyPress);

            questionInput.disabled = false;

            loadingDiv.classList.add("hidden");

            chatContainer.scrollTop = chatContainer.scrollHeight;

            questionInput.value = "";
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

    chatContainer.prepend(messageDiv);
}

function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        askQuestion();
    }
}

document.getElementById("question").addEventListener("keypress", handleEnterKeyPress);
