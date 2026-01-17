import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState,
    Browsers
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import { getAIResponse } from './aiService.js';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

// Configuration
const AUTO_REPLY_DELAY = parseInt(process.env.AUTO_REPLY_DELAY || '300000'); // 5 minutes default
const userActivity = new Map(); // Track last activity time for each chat

// Logger
const logger = pino({ level: 'silent' }); // Set to 'info' for debugging

async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

        const sock = makeWASocket({
            auth: state,
            logger,
            browser: Browsers.ubuntu('Chrome'),
            version: [2, 2412, 54],
            syncFullHistory: false
        });

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Display QR code if available
        if (qr) {
            console.log('\n' + '='.repeat(50));
            console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP');
            console.log('='.repeat(50) + '\n');
            qrcode.generate(qr, { small: true });
            console.log('\n' + '='.repeat(50));
            console.log('Steps:');
            console.log('1. Open WhatsApp on your phone');
            console.log('2. Go to Settings → Linked Devices');
            console.log('3. Click "Link a Device"');
            console.log('4. Point camera at this QR code');
            console.log('='.repeat(50) + '\n');
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            console.log('🔌 Connection closed');
            console.log('Error:', lastDisconnect?.error?.message);
            
            if (shouldReconnect) {
                console.log('🔄 Reconnecting in 3 seconds...\n');
                setTimeout(() => connectToWhatsApp(), 3000);
            } else {
                console.log('❌ You were logged out. Please:');
                console.log('   1. Delete the auth_info_baileys folder');
                console.log('   2. Run: npm start');
                console.log('   3. Scan the QR code again\n');
            }
        } else if (connection === 'open') {
            console.log('\n✅ ✅ ✅ WhatsApp Connected Successfully! ✅ ✅ ✅\n');
            console.log(`⏱️  Auto-reply will trigger after ${AUTO_REPLY_DELAY / 1000} seconds of inactivity`);
            console.log('⏳ Bot is now running and waiting for messages...\n');
            
            // Display chat list
            setTimeout(() => displayChatList(sock), 2000);
        }
    });

    // Save credentials when updated
    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const message of messages) {
            try {
                // Skip if no message content
                if (!message.message) continue;

                const messageContent = 
                    message.message.conversation ||
                    message.message.extendedTextMessage?.text ||
                    '';

                if (!messageContent) continue;

                const chatId = message.key.remoteJid;
                const isGroup = chatId.endsWith('@g.us');
                const isFromMe = message.key.fromMe;

                // Get sender info
                const senderNumber = message.key.participant || message.key.remoteJid;
                const senderName = message.pushName || senderNumber.split('@')[0];

                // Skip group messages if configured
                if (isGroup && process.env.SKIP_GROUPS === 'true') {
                    continue;
                }

                // If message is from me (the bot owner)
                if (isFromMe) {
                    console.log(`👤 You replied in chat: ${chatId}`);
                    // Update activity time when you reply
                    userActivity.set(chatId, Date.now());
                    continue;
                }

                console.log(`📩 Message from ${senderName}: ${messageContent}`);

                // Check if we should auto-reply
                const lastActivity = userActivity.get(chatId) || 0;
                const timeSinceLastActivity = Date.now() - lastActivity;

                if (timeSinceLastActivity >= AUTO_REPLY_DELAY) {
                    // Send typing indicator
                    await sock.sendPresenceUpdate('composing', chatId);

                    // Get AI response based on your personality
                    const aiResponse = await getAIResponse(messageContent, senderName, isGroup);

                    if (aiResponse) {
                        // Simulate realistic typing delay
                        const typingDelay = Math.min(aiResponse.length * 50, 5000);
                        await new Promise(resolve => setTimeout(resolve, typingDelay));

                        // Send the response
                        await sock.sendMessage(chatId, { text: aiResponse });
                        console.log(`🤖 AI replied to ${senderName}: ${aiResponse}`);

                        // Update activity time
                        userActivity.set(chatId, Date.now());

                        // Stop typing indicator
                        await sock.sendPresenceUpdate('paused', chatId);
                    }
                } else {
                    const remainingTime = Math.ceil((AUTO_REPLY_DELAY - timeSinceLastActivity) / 1000);
                    console.log(`⏳ Waiting ${remainingTime}s before auto-reply...`);
                }

            } catch (error) {
                console.error('❌ Error handling message:', error);
            }
        }
    });

    return sock;
    } catch (error) {
        console.error('❌ Fatal error in bot:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Delete auth_info_baileys folder: npm run clean');
        console.error('2. Restart the bot: npm start');
        console.error('3. Scan the QR code carefully\n');
        process.exit(1);
    }
}

/**
 * Display your WhatsApp chat list
 */
async function displayChatList(sock) {
    try {
        const chats = await sock.groupMetadata ? sock.groupMetadata : [];
        const contacts = await sock.contacts;

        console.log('\n' + '='.repeat(60));
        console.log('📱 YOUR WHATSAPP CHATS & CONTACTS');
        console.log('='.repeat(60) + '\n');

        // Get all chats
        let chatCount = 0;
        
        // Display individual chats
        console.log('👥 INDIVIDUAL CHATS:\n');
        
        try {
            // Get chats by fetching from sock (Baileys API)
            if (sock.store && sock.store.chats) {
                const individualChats = sock.store.chats
                    .filter(chat => !chat.id.endsWith('@g.us'))
                    .slice(0, 50); // Show last 50 chats

                if (individualChats.length === 0) {
                    console.log('  No individual chats yet. Wait for incoming messages.\n');
                } else {
                    individualChats.forEach((chat, index) => {
                        const phoneNumber = chat.id.replace('@c.us', '');
                        console.log(`  ${index + 1}. ${chat.name || phoneNumber}`);
                    });
                    console.log();
                }
                chatCount = individualChats.length;
            }
        } catch (err) {
            console.log('  (Chats will appear when you receive messages)\n');
        }

        // Display group chats
        console.log('👫 GROUP CHATS:\n');
        
        try {
            if (sock.store && sock.store.chats) {
                const groupChats = sock.store.chats
                    .filter(chat => chat.id.endsWith('@g.us'))
                    .slice(0, 50);

                if (groupChats.length === 0) {
                    console.log('  No group chats yet.\n');
                } else {
                    groupChats.forEach((chat, index) => {
                        console.log(`  ${index + 1}. ${chat.name || 'Unnamed Group'}`);
                    });
                    console.log();
                }
            }
        } catch (err) {
            console.log('  (Groups will appear when you receive messages)\n');
        }

        // Display saved contacts
        console.log('📋 YOUR CONTACTS:\n');
        
        try {
            if (sock.store && sock.store.contacts) {
                const contactList = Object.values(sock.store.contacts)
                    .filter(c => c.id && !c.id.endsWith('@g.us'))
                    .slice(0, 30);

                if (contactList.length === 0) {
                    console.log('  No saved contacts in WhatsApp yet.\n');
                } else {
                    contactList.forEach((contact, index) => {
                        const name = contact.name || contact.id.replace('@c.us', '');
                        console.log(`  ${index + 1}. ${name}`);
                    });
                    console.log();
                }
            }
        } catch (err) {
            console.log('  (Contacts sync in progress...)\n');
        }

        console.log('='.repeat(60));
        console.log('💡 Note: Full chat/contact list syncs as you receive messages');
        console.log('✉️  Type messages to load more chats into the list');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error fetching chat list:', error.message);
        console.log('💡 The chat list will be populated as you receive messages.\n');
    }
}

// Start the bot
console.log('\n' + '='.repeat(60));
console.log('🚀 STARTING WHATSAPP AI BOT...');
console.log('='.repeat(60) + '\n');
console.log('⏳ Connecting to WhatsApp...');
console.log('📱 Waiting for QR code to appear...\n');

connectToWhatsApp().catch(error => {
    console.error('❌ Failed to start bot:', error.message);
    process.exit(1);
});
