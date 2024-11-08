import inquirer from 'inquirer';
import chalk from 'chalk';

export async function getMainAction() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.yellow('What would you like to do?'),
      choices: [
        'Start PDF Editor',
        'Configure Settings',
        'Check for Updates',
        'View Documentation',
        'Exit'
      ]
    }
  ]);
  return action;
}

export async function getSettings() {
  return inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features to enable:',
      choices: [
        'AI Analysis',
        'Auto-Save',
        'Dark Mode',
        'Page Thumbnails'
      ]
    },
    {
      type: 'input',
      name: 'autosaveInterval',
      message: 'Auto-save interval (minutes):',
      default: '5',
      when: (answers) => answers.features.includes('Auto-Save'),
      validate: (value) => !isNaN(value) || 'Please enter a number'
    },
    {
      type: 'confirm',
      name: 'enableLogging',
      message: 'Enable debug logging?',
      default: false
    }
  ]);
}