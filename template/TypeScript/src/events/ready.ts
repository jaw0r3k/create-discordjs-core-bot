import { GatewayDispatchEvents } from '@discordjs/core';
import type { Event } from './index.js';

export default {
	name: GatewayDispatchEvents.Ready,
	once: true,
	async execute({ data }) {
		console.log(`I am ready! Bot is logged in as ${data.user.username}`);
	},
} satisfies Event<GatewayDispatchEvents.Ready>;
