import { GatewayDispatchEvents, InteractionType } from '@discordjs/core';

/**
 * @param {Map<string, import('../commands/index.js').Command>} commands
 * @param {import('../events/index.js').Event[]} events
 * @param {import('@discordjs/core').Client} client
 */
 export function registerHandlers(commands, events, client) {
	// Create an event to handle command interactions
	/** @type {import('../events/index.js').Event<GatewayDispatchEvents.IntegrationCreate>} */
	const interactionCreateEvent = {
		name: GatewayDispatchEvents.IntegrationCreate,
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
