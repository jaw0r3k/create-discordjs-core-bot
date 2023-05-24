import { GatewayDispatchEvents } from '@discordjs/core';

/** @type {import('./index.js').Event<'ready'>} */
export default {
	name: GatewayDispatchEvents.Ready,
	once: true,
	async execute({ data }) {
		console.log(`I am ready! Bot is logged in as ${data.user.username}`);
	},
};
