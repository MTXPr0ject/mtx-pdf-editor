import inquirer from 'inquirer';
import chalk from 'chalk';

export async function getMainAction() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan.bold('What would you like to do?'),
      prefix: chalk.green('→'),
      choices: [
        {
          name: chalk.blue('📝 Start PDF Editor'),
          value: 'Start PDF Editor'
        },
        {
          name: chalk.yellow('⚙️  Configure Settings'),
          value: 'Configure Settings'
        },
        {
          name: chalk.magenta('🔄 Check for Updates'),
          value: 'Check for Updates'
        },
        {
          name: chalk.cyan('📚 View Documentation'),
          value: 'View Documentation'
        },
        {
          name: chalk.red('👋 Exit'),
          value: 'Exit'
        }
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
      message: chalk.yellow.bold('Select features to enable:'),
      prefix: chalk.green('→'),
      choices: [
        { name: chalk.blue('🤖 AI Analysis'), value: 'AI Analysis' },
        { name: chalk.magenta('💾 Auto-Save'), value: 'Auto-Save' },
        { name: chalk.cyan('🌙 Dark Mode'), value: 'Dark Mode' },
        { name: chalk.yellow('🖼️  Page Thumbnails'), value: 'Page Thumbnails' }
      ]
    },
    {
      type: 'input',
      name: 'autosaveInterval',
      message: chalk.blue.bold('Auto-save interval (minutes):'),
      prefix: chalk.green('→'),
      default: '5',
      when: (answers) => answers.features.includes('Auto-Save'),
      validate: (value) => !isNaN(value) || chalk.red('Please enter a number')
    },
    {
      type: 'confirm',
      name: 'enableLogging',
      message: chalk.magenta.bold('Enable debug logging?'),
      prefix: chalk.green('→'),
      default: false
    }
  ]);
}