import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

const CONFIG_FILE = path.join(process.cwd(), 'config.json');

export async function saveSettings(settings) {
  const spinner = ora('Saving settings...').start();
  try {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(settings, null, 2));
    spinner.succeed(chalk.green('Settings saved successfully!'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to save settings'));
    console.error(error.message);
  }
}

export async function loadSettings() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {
      features: [],
      autosaveInterval: 5,
      enableLogging: false
    };
  }
}