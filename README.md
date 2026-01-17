# 💬 AI Chat Web Application - Chat with Gagan Kumar's AI Assistant

An AI-powered web chat application that responds like Gagan Kumar using his personality, communication style, and preferences. The bot uses Cohere AI to generate authentic, friendly responses in a natural Hinglish conversational style.

## ✨ Features

- 🎭 **Personality-Based Responses**: Responds exactly like Gagan based on detailed personality prompts
- 🌐 **Web-Based Interface**: Clean, modern chat interface accessible from any browser
- 💬 **Context-Aware**: Understands different relationships and responds appropriately
- 🎨 **Customizable**: Fully configurable personality and behavior in `aiService.js`
- 🤖 **Cohere AI**: Powered by Cohere's `command-r-08-2024` model
- 📝 **Chat History**: Maintains conversation history during the session
- 🖼️ **Custom Background**: Beautiful chat interface with personalized background image

## 📋 Prerequisites

- Node.js (v18 or higher)
- A Cohere API key ([Get it here](https://dashboard.cohere.com/))

## 🚀 Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Edit `.env` and add your Cohere API key:

\`\`\`env
COHERE_API_KEY=your-cohere-api-key-here
COHERE_MODEL=command-r-08-2024
\`\`\`

### 3. Customize Your Personality

Open `aiService.js` and edit the `PERSONALITY_PROMPT` section with your information:

\`\`\`javascript
const PERSONALITY_PROMPT = \`You are Gagan Kumar.

Identity & Background:
- Name: Gagan Kumar
- Works as Member Technical Staff (MTS) at Oracle
- M.Tech in Computer Science & Information Security from NIT Warangal

Personality:
- Funny and light-hearted: always replies in a funny, entertaining way
- Uses Hinglish (mix of Hindi and English) naturally
- Supportive and a little bit emotional
// ... add MORE details about yourself!
\`\`\`

### 4. Start the Server

\`\`\`bash
npm start
\`\`\`

### 5. Open in Browser

Visit: **http://localhost:3000**

### 6. Start Chatting!

- Enter your name
- Type a message
- Get AI responses that sound like Gagan!

## ⚙️ Configuration Options

Edit `.env` to customize behavior:

| Variable | Description | Default |
|----------|-------------|---------|
| `COHERE_API_KEY` | Your Cohere API key | Required |
| `COHERE_MODEL` | Model to use | `command-r-08-2024` |
| `PORT` | Server port | `3000` |
| `FALLBACK_MESSAGE` | Message if AI fails | Custom message |

## 🎯 How It Works

1. **User Input**: User enters a message in the web interface
2. **AI Processing**: Message is sent to Cohere AI with personality context
3. **Response Generation**: AI generates a response matching Gagan's style
4. **Display**: Response is displayed in the chat interface
5. **History**: Chat history is maintained for the session

## 💡 Pro Tips

### Making It Sound More Like You

1. **Be Specific**: Include actual phrases and expressions you use
   - Example: "Uses Hinglish like 'yaar', 'bhai', 'thoda sa'"

2. **Add Details**: Include hobbies, interests, and personal traits
   - "Loves cooking: pav bhaji, pasta, noodles, chole puri"
   - "Goes to gym in the morning"

3. **Communication Style**: Specify how you communicate
   - "Funny and entertaining, like chatting with a close friend"
   - "Uses Hinglish naturally, not professional"

4. **Relationships**: Describe your important relationships
   - "Has one close school friend (doesn't reveal name)"
   - "Two brothers: Akash and Ramji"

## 📁 Project Structure

\`\`\`
├── server.js              # Express server & API endpoints
├── aiService.js           # Cohere AI integration & personality
├── public/
│   ├── index.html        # Chat interface
│   ├── styles.css        # Styling
│   ├── app.js            # Client-side JavaScript
│   └── dp.webp           # Background image
├── .env                  # Configuration (not in git)
├── package.json          # Dependencies
└── README.md             # This file
\`\`\`

## 🔒 Privacy & Security

- ✅ Runs locally on your machine
- ✅ No data stored permanently (session-based history only)
- ✅ API calls only to Cohere
- ⚠️ Never share your `.env` file or API keys
- ⚠️ Add `.env` to `.gitignore`

## 🔧 Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify `.env` file exists with correct API key
- Run `npm install` to ensure dependencies are installed

### AI not responding
- Verify COHERE_API_KEY is valid
- Check internet connection
- Ensure Cohere model `command-r-08-2024` is accessible

### Wrong personality responses
- Check `aiService.js` PERSONALITY_PROMPT configuration
- Restart server after making changes

### Chat history not working
- History is session-based (clears on server restart)
- Check browser console for errors

## 📜 Available Scripts

```bash
npm start              # Start the web server
npm run dev           # Start with auto-reload on file changes
npm run start:whatsapp # Start WhatsApp bot mode (optional)
npm run dev:whatsapp  # WhatsApp bot with auto-reload
```

## 🛑 Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

## 🚀 Future Enhancements

- [ ] Add user authentication
- [ ] Persistent chat history (database integration)
- [ ] Multiple chat rooms/sessions
- [ ] Voice message support
- [ ] Dark/light theme toggle
- [ ] Export chat history

## 📄 License

ISC

## 👨‍💻 Author

**Gagan Kumar**
- 🏢 Oracle MTS
- 🎓 NIT Warangal
- 📧 [GitHub](https://github.com/gagancoder123/gaganaibot.git)

---

Made with ❤️ using Cohere AI • Chat with your friendly AI assistant anytime!
- Very energetic and enthusiastic
- Uses lots of emojis especially 💕 ✨ 🔥
- Types in lowercase mostly
- Quick to respond normally
- Super supportive friend

**Communication Style:**
- Greeting: "heyyyy" or "omg hi" or just "hey hey"
- Common phrases: "no wayyy", "literally", "obsessed", "love that for you"
- Response length: Short bursts, multiple messages instead of long ones
- Emoji usage: Almost every message has emojis

**Current Situation:**
- Working on a major product launch this week
- Super busy with meetings and presentations
- Might be unavailable during work hours (9am-6pm EST)

**Common Responses:**
- "How are you?": "heyy! i'm good just super busy with work rn 😅 hbu?"
- Availability: "in meetings all day 😭 catch you later?"
- Good news: "omg no wayyy that's amazing!! 💕✨ so happy for you"
- Need help: "absolutely! let me get back to you in a bit, kinda swamped rn"
\`\`\`

## 📄 License

ISC

## ⚠️ Disclaimer

This bot is for personal use only. Make sure to:
- Inform people that an AI might respond when you're busy
- Don't use it for important conversations
- Regularly check and respond personally when possible
- Follow WhatsApp's Terms of Service

---

Made with ❤️ for when you're too busy to reply but still want to stay connected!
