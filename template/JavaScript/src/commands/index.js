/**
 * @typedef {object} Command
 * Defines the structure of a command.
 * @property {import('@discordjs/core').RESTPostAPIApplicationCommandsJSONBody} data The data for the command.
 * @property {(interaction: import('@discordjs/core').APIApplicationCommandInteraction, api: import('@discordjs/core').API) => Promise<void> | void} execute The function to execute when the command is called.
 */

/**
 * Defines the predicate to check if an object is a valid Command type.
 *
 * @param {import('../util/loaders.js').StructurePredicate<Command>} structure
 * @returns {structure is Command}
 */
export const predicate = (structure) =>
	Boolean(structure) &&
	typeof structure === 'object' &&
	typeof structure.data === 'object' &&
	typeof structure.execute === 'function';
