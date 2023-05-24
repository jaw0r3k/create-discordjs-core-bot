/** @type {import('./index.js').Command} */
export default {
	data: {
		name: 'ping',
		description: 'Ping!',
	},
	async execute(interaction, api) {
		await api.interactions.reply(interaction.id, interaction.token, { content: 'Pong!' });
	},
};
