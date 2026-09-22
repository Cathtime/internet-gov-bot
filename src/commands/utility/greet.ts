import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('greet')
        .setDescription('Greets you with hello!'),

    async execute(interaction: any) {
        await interaction.reply(`Hi, ${interaction.user.username}!`);
    }
}