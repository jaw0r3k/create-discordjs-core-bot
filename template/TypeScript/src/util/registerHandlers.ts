import { type Client, GatewayDispatchEvents, InteractionType } from '@discordjs/core';
import type { Command } from '../commands/index.js';
import type { Event } from '../events/index.js';

export function registerHandlers(commands: Map<string, Command>, events: Event[], client: Client): void {
	// Create an event to handle command interactions
	const interactionCreateEvent: Event<GatewayDispatchEvents.InteractionCreate> = {
		name: GatewayDispatchEvents.InteractionCreate,
		async execute({ data, api }) {
			if (data.type === InteractionType.ApplicationCommand) {
				const command = commands.get(data.data.name);

				if (!command) {
					throw new Error(`Command '${data.data.name}' not found.`);
				}

				await command.execute(data, api);
			}
		},
	};

	for (const event of [...events, interactionCreateEvent]) {
		client[event.once ? 'once' : 'on'](event.name, async (...args) => event.execute(...args));
	}
}
