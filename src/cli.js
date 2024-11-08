import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import ora from 'ora';
import boxen from 'boxen';

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome() {
  console.clear();
  const title = figlet.textSync('MTX CLI', {
    font: 'ANSI Shadow',
    horizontalLayout: 'fitted'
  });
  
  console.log(
    gradient.pastel.multiline(title) + '\n' +
    boxen(chalk.blue('Welcome to MTX PDF Editor CLI'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    })
  );
  
  await sleep(1000);
}

async function promptOptions() {
  const answers = await inquirer.prompt([
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
  
  return answers;
}

async function handleAction(action) {
  const spinner = ora();
  
  switch (action) {
    case 'Start PDF Editor':
      spinner.start(chalk.cyan('Starting PDF Editor...'));
      await sleep(1500);
      spinner.succeed(chalk.green('PDF Editor started successfully!'));
      break;
      
    case 'Configure Settings':
      const settings = await inquirer.prompt([
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
        }
      ]);
      console.log(
        boxen(chalk.green('Settings updated successfully!'), {
          padding: 1,
          borderStyle: 'round',
          borderColor: 'green'
        })
      );
      break;
      
    case 'Check for Updates':
      spinner.start('Checking for updates...');
      await sleep(1000);
      spinner.info(chalk.blue('You are running the latest version!'));
      break;
      
    case 'View Documentation':
      console.log(
        boxen(chalk.yellow('Documentation: https://github.com/MTXPr0ject/mtx-pdf-editor#readme'), {
          padding: 1,
          borderStyle: 'round',
          borderColor: 'yellow'
        })
      );
      break;
      
    case 'Exit':
      console.log(
        gradient.rainbow('\nThank you for using MTX PDF Editor!\n')
      );
      process.exit(0);
  }
}

async function main() {
  await welcome();
  
  while (true) {
    const { action } = await promptOptions();
    await handleAction(action);
    if (action !== 'Exit') {
      await sleep(1000);
    }
  }
}

main().catch(console.error);