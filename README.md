# 🤖 WhatsApp AI Bot - Your Personal Auto-Responder

An AI-powered WhatsApp bot that responds like YOU when you're unavailable. The bot uses OpenAI to learn your personality, communication style, and preferences to generate authentic responses.

## ✨ Features

- 🎭 **Personality Mirroring**: Responds exactly like you based on detailed prompts
- ⏰ **Smart Auto-Reply**: Only responds after a configurable period of inactivity
- 💬 **Context-Aware**: Understands different relationships (friends, family, colleagues)
- 👥 **Group Chat Support**: Can handle both individual and group conversations
- 🔐 **Secure**: Uses local authentication for WhatsApp
- 🎨 **Customizable**: Fully configurable personality and behavior

## 📋 Prerequisites

- Node.js (v18 or higher)
- An OpenAI API key ([Get it here](https://platform.openai.com/api-keys))
- A WhatsApp account

## 🚀 Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Copy the example environment file and add your OpenAI API key:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your OpenAI API key:

\`\`\`env
OPENAI_API_KEY=sk-your-actual-api-key-here
\`\`\`

### 3. Customize Your Personality

**This is the most important step!** Open `aiService.js` and edit the `PERSONALITY_PROMPT` section with detailed information about yourself:

\`\`\`javascript
const PERSONALITY_PROMPT = \`You are responding as if you are the owner...

**Basic Information:**
- Name: Alex
- Age: 25
- Location: London, UK
- Occupation: Software Developer

**Personality Traits:**
- Friendly and casual
- Uses emojis frequently 😊
- Prefers short messages
- Often makes jokes

// ... add MORE details about yourself!
\`\`\`

The more detailed you are, the better the bot will mimic you. Include:
- How you greet people
- Your common phrases and slang
- Your interests and hobbies
- How you respond in different situations
- Topics you know/don't know about

### 4. Start the Bot

\`\`\`bash
npm start
\`\`\`

### 5. Scan QR Code

A QR code will appear in your terminal. Scan it with WhatsApp (Settings → Linked Devices → Link a Device).

### 6. Test It!

- Have someone message you
- Wait for the configured delay (default: 5 minutes)
- The bot will automatically respond in your style!

## ⚙️ Configuration Options

Edit `.env` to customize behavior:

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `OPENAI_MODEL` | Model to use | `gpt-4-turbo-preview` |
| `AUTO_REPLY_DELAY` | Delay before auto-reply (ms) | `300000` (5 min) |
| `SKIP_GROUPS` | Skip group messages | `false` |
| `FALLBACK_MESSAGE` | Message if AI fails | Custom message |

### Delay Examples:
- 1 minute: `60000`
- 5 minutes: `300000`
- 10 minutes: `600000`
- 30 minutes: `1800000`

## 🎯 How It Works

1. **Message Received**: Someone messages you on WhatsApp
2. **Activity Check**: Bot checks if you've replied recently
3. **Delay Timer**: Waits for configured delay (default: 5 minutes)
4. **AI Processing**: If you haven't replied, sends message to OpenAI with your personality prompt
5. **Response**: Bot sends AI-generated response that sounds like you
6. **Reset Timer**: When you reply, timer resets for that chat

## 💡 Pro Tips

### Making It Sound More Like You

1. **Be Specific**: Include actual phrases you use, not generic descriptions
   - ❌ "I'm friendly"
   - ✅ "I always start with 'Yo!' or 'Heyy' and end with 👍"

2. **Add Examples**: Include real conversation examples
   \`\`\`
   Friend: "Wanna hang out?"
   You: "Can't today bro, swamped with work 😅 maybe tmrw?"
   \`\`\`

3. **Update Regularly**: Keep your prompt updated with current situations
   - "Currently working on a big project, super busy this week"
   - "Preparing for exams, might be slow to respond"

4. **Different Contexts**: Specify how you talk to different people
   - Friends: Casual, lots of slang
   - Family: More formal, caring
   - Colleagues: Professional but friendly

### Testing Your Bot

Before using it live, test the AI service:

1. Uncomment the test code at the bottom of `aiService.js`
2. Run: `node aiService.js`
3. Check if responses sound like you
4. Adjust the personality prompt as needed

## 🔒 Privacy & Security

- ✅ Runs locally on your machine
- ✅ WhatsApp session stored locally
- ✅ No data sent anywhere except OpenAI API
- ⚠️ Never share your `.env` file or API keys
- ⚠️ Be mindful of what information you include in prompts

## 🐛 Troubleshooting

### QR Code Not Appearing
- Make sure you have a stable internet connection
- Delete `.wwebjs_auth` folder and restart

### Bot Not Responding
- Check your OpenAI API key is valid
- Ensure you have API credits remaining
- Check console for error messages

### Wrong Personality
- Edit `aiService.js` and add more specific details
- Test responses using the test function
- Increase temperature in API call for more variation

### "Module not found" Errors
- Make sure you ran `npm install`
- Check that you're using Node.js v18+

## 📊 Cost Estimation

With GPT-4 Turbo:
- Average message: ~$0.01
- 100 auto-replies: ~$1.00
- 1000 auto-replies: ~$10.00

With GPT-3.5 Turbo (change in `.env`):
- Average message: ~$0.001
- Much cheaper but less accurate personality

## 🛑 Stopping the Bot

- Press `Ctrl + C` in the terminal
- The bot will disconnect gracefully
- To restart: `npm start`

## 📝 Example Personality Prompt

Here's a detailed example to help you create yours:

\`\`\`javascript
**Basic Information:**
- Name: Sarah
- Age: 23
- Location: New York
- Occupation: Marketing Manager at a tech startup

**Personality Traits:**
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
