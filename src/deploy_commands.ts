import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(import.meta.dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.ts'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const commandImport = await import(filePath);
        const command = commandImport.default; // when exporting I guess I have to check default

		if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);

            for (const properties in command.default) {
                console.log(`${filePath} has ${properties}`);
            }
		}
	}
}

const token: string = process.env.DiscordToken ?? '';
const clientId: string = process.env.clientId ?? '';
const guildId: string = process.env.guildId ?? '';

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();