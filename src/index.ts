#!/usr/bin/env node

// eslint-disable-next-line n/shebang
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import chalk from 'chalk';
import { program } from 'commander';
import validateProjectName from 'validate-npm-package-name';
import { install, resolvePackageManager } from './helpers/packageManager.js';
import prompts from 'prompts';
(async () => {
	program
		.description('Create a basic @discordjs/core bot.')
		.option('--typescript', 'Whether to use the TypeScript template.')
		.argument('<directory>', 'The directory where this will be created.')
		.parse();

	let { typescript } = program.opts();
	const [directory] = program.args;

	if (!directory) {
		console.error(chalk.red('Please specify the project directory.'));
		process.exit(1);
	}

	const root = path.resolve(directory);
	const directoryName = path.basename(root);

	if (existsSync(root) && readdirSync(root).length > 0) {
		console.error(chalk.red(`The directory ${chalk.yellow(`"${directoryName}"`)} is not empty.`));
		console.error(chalk.red(`Please specify an empty directory.`));
		process.exit(1);
	}

	// We'll use the directory name as the project name. Check npm name validity.
	const validationResult = validateProjectName(directoryName);

	if (!validationResult.validForNewPackages) {
		console.error(
			chalk.red(
				`Cannot create a project named ${chalk.yellow(
					`"${directoryName}"`,
				)} due to npm naming restrictions.\n\nErrors:`,
			),
		);

		for (const error of [...(validationResult.errors ?? []), ...(validationResult.warnings ?? [])]) {
			console.error(chalk.red(`- ${error}`));
		}

		console.error(chalk.red('\nSee https://docs.npmjs.com/cli/configuring-npm/package-json for more details.'));
		process.exit(1);
	}

	if (!typescript) {
		const response = await prompts([
			{
				type: 'select',
				name: 'language',
				message: 'Select the language your bot will be in',
				choices: [
					{ title: 'JavaScript', value: 'js' },
					{ title: 'TypeScript', value: 'ts', selected: true },
				],
			},
		]);
		if (!response.language) {
			console.error(chalk.red(`No language specified!`));
			process.exit(1);
		}

		typescript = response.language === 'ts';
	}

	if (!existsSync(root)) {
		mkdirSync(root, { recursive: true });
	}

	console.log(`Creating ${directoryName} in ${chalk.green(root)}.`);
	cpSync(new URL(`../template/${typescript ? 'TypeScript' : 'JavaScript'}`, import.meta.url), root, {
		recursive: true,
	});

	process.chdir(root);

	const newPackageJSON = readFileSync('./package.json', { encoding: 'utf8' }).replace('[REPLACE-NAME]', directoryName);
	writeFileSync('./package.json', newPackageJSON);

	const packageManager = resolvePackageManager();
	install(packageManager);
	console.log(chalk.green('All done succesfully!'));
})();
