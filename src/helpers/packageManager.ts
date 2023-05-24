import { execSync } from 'node:child_process';
import process from 'node:process';
import chalk from 'chalk';

/**
 * A union of supported package managers.
 */
export type PackageManager = 'npm' | 'pnpm' | 'yarn';

/**
 * Resolves the package manager from `npm_config_user_agent`.
 */
export function resolvePackageManager(): PackageManager {
	const npmConfigUserAgent = process.env.npm_config_user_agent;

	// If this is not present, return the default package manager.
	if (!npmConfigUserAgent) {
		return 'npm';
	}

	if (npmConfigUserAgent.startsWith('npm')) {
		return 'npm';
	}

	if (npmConfigUserAgent.startsWith('yarn')) {
		return 'yarn';
	}

	if (npmConfigUserAgent.startsWith('pnpm')) {
		return 'pnpm';
	}

	console.error(
		chalk.yellow(
			`Detected an unsupported package manager (${npmConfigUserAgent}). Falling back to npm.`,
		),
	);

	// Fallback to the default package manager.
	return 'npm';
}

/**
 * Installs with a provided package manager.
 *
 * @param packageManager - The package manager to use
 */
export function install(packageManager: PackageManager) {
	let installCommand;

	switch (packageManager) {
		case 'npm':
		case 'pnpm':
			installCommand = `${packageManager} install`;
			break;
		case 'yarn':
			installCommand = packageManager;
			break;
	}

	console.log(`Installing dependencies with ${packageManager}...`);

	execSync(installCommand, {
		stdio: 'inherit',
	});
}