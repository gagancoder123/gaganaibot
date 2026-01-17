// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const userNameInput = document.getElementById('userNameInput');
const nameInputGroup = document.getElementById('nameInputGroup');
const typingIndicator = document.getElementById('typingIndicator');
// (Removed dynamic UI elements)

// State
let userName = '';
let isSending = false;
// (Removed dynamic suggestions and background state)

// Initialize
// (Reverted to basic initialization)
loadChatHistory();
setupEventListeners();

function setupEventListeners() {
    // User name input
    userNameInput.addEventListener('input', (e) => {
        userName = e.target.value.trim();
        if (userName) {
            nameInputGroup.style.display = 'none';
            messageInput.focus();
        }
    });

    // Message input
    messageInput.addEventListener('input', (e) => {
        sendBtn.disabled = !e.target.value.trim();
        autoResizeTextarea(e.target);
    });

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send button
    sendBtn.addEventListener('click', sendMessage);

    // Clear button
    clearBtn.addEventListener('click', clearChat);

    // (Removed theme toggle and background refresh)
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
}

async function sendMessage() {
    if (isSending) return;
    
    const message = messageInput.value.trim();
    if (!message) return;

    // Check if we have a username
    if (!userName) {
        userNameInput.focus();
        return;
    }

    isSending = true;
    sendBtn.disabled = true;

    // Clear input immediately for better UX
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Add user message to UI
    addMessageToUI(userName, message, true);

    // Show typing indicator
    typingIndicator.style.display = 'block';
    scrollToBottom();

    try {
        // Send to server
        const response = await fetch('/api/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userName: userName
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();

        // Hide typing indicator
        typingIndicator.style.display = 'none';

        // Add AI response to UI
        addMessageToUI('Gagan Kumar', data.aiMessage.text, false);

    } catch (error) {
        console.error('Error sending message:', error);
        typingIndicator.style.display = 'none';
        
        addMessageToUI('System', '❌ Sorry, there was an error sending your message. Please try again.', false);
    } finally {
        isSending = false;
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

function addMessageToUI(sender, text, isUser) {
    // Remove welcome message if present
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = isUser ? sender.charAt(0).toUpperCase() : 'GK';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (!isUser) {
        const senderSpan = document.createElement('div');
        senderSpan.className = 'message-sender';
        senderSpan.textContent = sender;
        contentDiv.appendChild(senderSpan);
    }

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    contentDiv.appendChild(textDiv);

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(new Date());
    contentDiv.appendChild(timeDiv);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// (Removed typewriter effect, reverting to simple addMessageToUI)

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

async function loadChatHistory() {
    try {
        const response = await fetch('/api/chat/history');
        const data = await response.json();

        if (data.messages && data.messages.length > 0) {
            // Remove welcome message
            const welcomeMsg = document.querySelector('.welcome-message');
            if (welcomeMsg) {
                welcomeMsg.remove();
            }

            // Display all messages
            data.messages.forEach(msg => {
                addMessageToUI(msg.sender, msg.text, msg.isUser);
            });
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

async function clearChat() {
    if (!confirm('Are you sure you want to clear the chat history?')) {
        return;
    }

    try {
        const response = await fetch('/api/chat/clear', {
            method: 'POST'
        });

        if (response.ok) {
            // Clear UI
            chatMessages.innerHTML = `
                <div class="welcome-message">
                    <div class="avatar-large">GK</div>
                    <h2>Welcome! 👋</h2>
                    <p>I'm an AI assistant representing Gagan Kumar. Feel free to ask me anything!</p>
                </div>
            `;

            // Reset name input
            userName = '';
            userNameInput.value = '';
            nameInputGroup.style.display = 'block';
            messageInput.value = '';
            sendBtn.disabled = true;
        }
    } catch (error) {
        console.error('Error clearing chat:', error);
        alert('Failed to clear chat. Please try again.');
    }
}

// (Removed suggestions/chips/background/placeholder rotation)

// Initial focus
if (!userName) {
    userNameInput.focus();
} else {
    messageInput.focus();
}
