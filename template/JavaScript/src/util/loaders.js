import { readdir, stat } from 'node:fs/promises';
import { URL } from 'node:url';
import { predicate as commandPredicate } from '../commands/index.js';
import { predicate as eventPredicate } from '../events/index.js';

/**
 * A predicate to check if the structure is valid.
 *
 * @template T
 * @typedef {(structure: unknown) => structure is T } StructurePredicate
 */

/**
 * Loads all the structures in the provided directory.
 *
 * @template T
 * @param {import('node:fs').PathLike} dir - The directory to load the structures from
 * @param {StructurePredicate<T>} predicate - The predicate to check if the structure is valid
 * @returns {Promise<T[]>}
 */
export async function loadStructures(dir, predicate) {
	const statDir = await stat(dir);

	if (!statDir.isDirectory()) {
		throw new Error(`The directory '${dir}' is not a directory.`);
	}

	// Get all the files in the directory
	const files = await readdir(dir);

	// Create an empty array to store the structures
	/** @type {T[]} */
	const structures = [];

	// Loop through all the files in the directory
	for (const file of files) {
		if (file === 'index.js' || !file.endsWith('.js')) {
			continue;
		}

		const statFile = await stat(new URL(`${dir}/${file}`));

		// Recursively load the structures in a directory
		if (statFile.isDirectory()) {
			structures.push(...(await loadStructures(`${dir}/${file}`, predicate)));
			continue;
		}

		// Dynamically import the structure  from the file
		const structure = (await import(`${dir}/${file}`)).default;

		// If the structure is a valid structure, add it
		if (predicate(structure)) structures.push(structure);
	}

	return structures;
}

/**
 * @param {import('node:fs').PathLike} dir
 * @returns {Promise<Map<string,import('../commands/index.js').Command>>}
 */
export async function loadCommands(dir) {
	return (await loadStructures(dir, commandPredicate)).reduce((acc, cur) => acc.set(cur.data.name, cur), new Map());
}

/**
 * @param {import('node:fs').PathLike} dir
 * @returns {Promise<import('../events/index.js').Event[]>}
 */
export async function loadEvents(dir) {
	return loadStructures(dir, eventPredicate);
}
