import process from 'node:process';
import { URL } from 'node:url';
import { Client, GatewayIntentBits } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { loadCommands, loadEvents } from './util/loaders.js';
import { registerHandlers } from './util/registerHandlers.js';

// Create REST and WebSocket managers directly
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

const gateway = new WebSocketManager({
  // You can easly change intents, depending on what events are you currently using
  intents: GatewayIntentBits.Guilds,
  token: process.env.DISCORD_TOKEN,
  rest,
});

// Create a client to emit relevant events.
const client = new Client({ rest, gateway });

// Load the events and commands
const events = await loadEvents(new URL('events/', import.meta.url));
const commands = await loadCommands(new URL('commands/', import.meta.url));

// Register the handlers
registerHandlers(commands, events, client);

// Start the WebSocket connection.
gateway.connect();
