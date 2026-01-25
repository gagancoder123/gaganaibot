import express from 'express';
import { getAIResponse } from './aiService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store chat history (in production, use a database)
const chatHistory = [];

// Main page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get chat history
app.get('/api/chat/history', (req, res) => {
    res.json({ messages: chatHistory });
});

// API endpoint to send a message
app.post('/api/chat/send', async (req, res) => {
    try {
        const { message, userName } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const name = userName || 'Guest';
        
        // Store user message
        const userMessage = {
            id: Date.now(),
            sender: name,
            text: message,
            timestamp: new Date().toISOString(),
            isUser: true
        };
        chatHistory.push(userMessage);

        // Get AI response
        console.log(`\n📩 Processing message from ${name}: ${message}`);
        const aiResponse = await getAIResponse(message, name, false);
        console.log(`✅ AI Response: ${aiResponse}\n`);

        // Store AI response
        const aiMessage = {
            id: Date.now() + 1,
            sender: 'Gagan Kumar',
            text: aiResponse,
            timestamp: new Date().toISOString(),
            isUser: false
        };
        chatHistory.push(aiMessage);

        // Send response
        res.json({ 
            userMessage, 
            aiMessage 
        });

    } catch (error) {
        console.error('❌ Error processing message:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            error: 'Failed to process message',
            details: error.message 
        });
    }
});

// Clear chat history
app.post('/api/chat/clear', (req, res) => {
    chatHistory.length = 0;
    res.json({ message: 'Chat history cleared' });
});

// Start server
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🌐 WEB CHAT APPLICATION STARTED');
    console.log('='.repeat(60));
    console.log(`\n✅ Server running at: http://localhost:${PORT}`);
    console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
    console.log('\n' + '='.repeat(60));
    console.log('💡 Features:');
    console.log('   • Real-time chat with AI personality');
    console.log('   • Same personality as WhatsApp bot');
    console.log('   • Clean web interface');
    console.log('='.repeat(60));
    
    // Check API key
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
        console.log('\n⚠️  WARNING: GROK_API_KEY is not configured!');
        console.log('⚠️  The bot will only return fallback messages.');
        console.log('⚠️  Please set your API key in the .env file\n');
    } else {
        console.log('\n✅ Groq API Key: Configured');
        console.log(`✅ Model: ${process.env.GROQ_MODEL || 'mixtral-8x7b-32768'}\n`);
    }
});
