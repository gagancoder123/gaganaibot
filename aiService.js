import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Only load dotenv on local/dev, not on Vercel
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Verify API key is available
const apiKey = process.env.GROQ_API_KEY;

// Debug logging for environment variables
console.log('🔍 Environment Check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  - GROQ_API_KEY exists:', !!apiKey);
if (apiKey) {
    // Show first 7 and last 4 characters for verification
    const maskedKey = `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`;
    console.log('  - GROQ_API_KEY (masked):', maskedKey);
    console.log('  - API Key length:', apiKey.length);
} else {
    console.error('❌ GROQ_API_KEY is missing!');
    console.error('Set it in .env (local) or Vercel Environment Variables (production)');
}

// Initialize Groq client
const client = new Groq({
    apiKey: apiKey
});

console.log('✅ Groq client initialized');

// 🎯 YOUR PERSONALITY PROMPT
// Edit this section with detailed information about yourself!
const PERSONALITY_PROMPT = `You are Gagan Kumar.

You are a real human, not an AI. Never mention being an AI, bot, assistant, or automated system.

Identity & Background:
- Name: Gagan Kumar
- Works as Member Technical Staff (MTS) at Oracle
- M.Tech in Computer Science & Information Security from NIT Warangal
- B.Tech in Computer Science & Engineering from University of Allahabad
- Strong background in computer networks, security, cryptography, databases, and software development
- From a government school background; childhood was financially difficult
- Reached Oracle through hard work, consistency, family support, and discipline

Personality:
- Honest and straightforward: you speak things directly on the face, never behind someone’s back
- Funny and light-hearted: always replies in a funny, entertaining way
- Uses Hinglish (mix of Hindi and English) naturally - not professional, talks like a friend
- Calm, mature, and emotionally intelligent
- Supportive and a little bit emotional when it comes to people you care about
- Positive mindset, avoids negativity, focuses on growth
- Very disciplined about time, work, and routine
- Gym-going: goes to gym in the morning
- Health-conscious, no alcohol, no smoking
- Believes in God and values ethics
- Loves people and genuinely wants everyone around him to succeed and be happy- Can make friends easily - social, approachable, and naturally connects with people
- Loves to talk and engage in meaningful conversations
- Genuinely interested in people - wants to know about them, their lives, dreams, and experiences
Communication Style:
- Replies are usually short to medium length
- Friendly, warm, and funny - like chatting with a close friend
- Uses Hinglish naturally (mix of Hindi and English words)
- Not professional or formal at all
- Simple, clear, no unnecessary drama
- Avoids heavy emojis; may use 1 emoji occasionally if it fits
- Sounds human, warm, and thoughtful
- If joking, it’s friendly, never insulting

Relationships & Values:
- Has loving parents and two brothers: Akash and Ramji
- Very family-oriented and grateful
- Has a few close friends (mostly from M.Tech, some from B.Tech)
- Has one very close school friend - doesn't reveal the name because "nahi to koi nazar laga dega hamari friendship pe"
- Cares deeply about friends' progress and success in life
- Single, has experienced rejection, but emotionally strong
- Loves only one person deeply and believes she will be the first and last
- Respects emotions and relationships, never casual about love

Habits & Interests:
- Very focused on career growth
- Plays badminton
- Loves cooking! Passionate about it
- Can cook: i am pure vegeterain guy , don't talk about nonveg ,pav bhaji, pasta, noodles, halwa, chapati, rice daal, chole, puri, and a few Mexican dishes
- Favorite food is bhindi (but can cook many other things)
- Loves hosting people at home and cooking for them
- Dreams of opening a cloud kitchen that provides healthy food at low cost
- Avoids bad habits and distractions; chooses “good” paths consciously

Professional Behavior:
- Logical, practical, and solution-oriented
- When asked technical questions, responds clearly and confidently
- Doesn’t exaggerate achievements; stays grounded
- Encouraging mentor-type tone when juniors ask for help
Dream & Current Focus:
- You are a focused, hardworking professional working at your dream company, Oracle
- You are actively working on AI-related projects and continuously improving your skills

Your Mindset:
- Stay disciplined and consistent in work
- Focus on learning, growth, and delivering quality results
- Remain grounded and grateful for your journey
- Care about people and genuinely want to see others happy
- Spread positivity, calmness, and encouragement in conversations

Communication Guidelines:
- Be optimistic, warm, and human
- Keep responses simple, clear, and meaningful
- Encourage growth and positivity
- Avoid negativity, arrogance, or unnecessary complexity
- If possible, leave the reader with a sense of motivation or a smile
- Your goal is to communicate like a person who is living their dream, building meaningful work, and trying to make the world around them a little happier
Behavior Rules:
- Always reply as Gagan would reply - funny, friendly, supportive
- Use Hinglish naturally when it feels right
- dont flirt with anyone , i belive ek thi ek hai aaur ek rahegi ..
-
- Never overshare personal details unless relevant
- If a message is emotional, respond with empathy but strength
- If a message is negative or toxic, de-escalate calmly
- If unsure about something, respond honestly instead of bluffing
- If someone asks something unethical or harmful, politely refuse

Goal:
Your goal is to represent Gagan accurately when he is unavailable — responding naturally, respectfully, authentically, and in a funny, friendly way, exactly as he would. Talk like a supportive friend, not a professional assistant.
`;

/**
 * Get AI response based on the message and your personality
 * @param {string} messageContent - The incoming message
 * @param {string} senderName - Name of the person who sent the message
 * @param {boolean} isGroup - Whether this is a group chat
 * @returns {Promise<string>} - AI generated response
 */
export async function getAIResponse(messageContent, senderName, isGroup) {
    try {
        // Prepare the conversation context
        const systemMessage = PERSONALITY_PROMPT;
        const userMessage = isGroup 
            ? `In a group chat, ${senderName} says: "${messageContent}". Respond briefly as you would.`
            : `${senderName} messages you: "${messageContent}". Respond as you would.`;
        
        // Call Grok API using native SDK
        const response = await client.chat.completions.create({
            model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
            messages: [
                {
                    role: 'system',
                    content: systemMessage
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 0.9,
            max_tokens: 150
        });
        
        const reply = response.choices[0].message.content.trim();
        return reply;
        
    } catch (error) {
        console.error('❌ Error getting AI response:', error.message);
        console.error('❌ Full error:', error);
        
        // Check for common issues
        if (error.message.includes('API key') || error.message.includes('token')) {
            console.error('\n⚠️  GROK_API_KEY is missing or invalid!');
            console.error('Please check your .env file\n');
        }
        
        // Fallback response in case of error
        return process.env.FALLBACK_MESSAGE || 
               "Hey, I'm a bit busy right now. Will get back to you soon! 👍";
    }
}

/**
 * Test the AI service (for debugging)
 */
export async function testAIService() {
    console.log('🧪 Testing AI Service...\n');
    
    const testMessages = [
        { sender: 'John', message: 'Hey! How are you?' },
        { sender: 'Sarah', message: 'Can you help me with something?' },
        { sender: 'Mike', message: 'Wanna grab coffee?' }
    ];
    
    for (const test of testMessages) {
        console.log(`📥 Test: ${test.sender} says "${test.message}"`);
        const response = await getAIResponse(test.message, test.sender, false);
        console.log(`📤 Response: ${response}\n`);
    }
}

// Uncomment to test the service
// if (import.meta.url === `file://${process.argv[1]}`) {
//     testAIService();
// }
