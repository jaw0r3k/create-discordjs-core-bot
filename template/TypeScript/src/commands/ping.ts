import type { Command } from './index.js';

export default {
	data: {
		name: 'ping',
		description: 'Ping!',
	},
	async execute(interaction, api) {
		await api.interactions.reply(interaction.id, interaction.token, { content: 'Pong!' });
	},
} satisfies Command;
