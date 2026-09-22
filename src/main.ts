import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', () => {
    if (client.user != null) {
        console.log(`Logged in as ${client.user.tag}`);
    }
});

client.login(process.env.DiscordToken);