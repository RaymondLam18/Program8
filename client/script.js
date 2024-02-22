const SERVER_URL = 'http://localhost:8000';
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (sender === 'user') {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('model-message');
    }
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
}

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    appendMessage(userMessage, 'user');
    userInput.value = '';

    const response = await fetch(`${SERVER_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: userMessage })
    });

    const responseData = await response.json();
    const modelResponse = responseData.response;
    appendMessage(modelResponse, 'model');
}

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/anime/recommendation');
    const data = await response.json();
    const recommendation = data.recommendation;
    appendMessage(recommendation, 'model');
});
