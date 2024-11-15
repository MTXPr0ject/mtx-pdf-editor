import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
import gradient from 'gradient-string';

const execAsync = promisify(exec);

export async function startEditor() {
  const spinner = ora({
    text: chalk.blue('Starting PDF Editor...'),
    spinner: 'dots12',
    color: 'cyan'
  }).start();

  try {
    await execAsync('npm run dev');
    spinner.succeed(
      chalk.green.bold('PDF Editor started successfully!') + '\n' +
      chalk.cyan('Ready to edit your PDFs...')
    );
  } catch (error) {
    spinner.fail(chalk.red.bold('Failed to start PDF Editor'));
    console.error(chalk.red(error.message));
  }
}

export async function checkUpdates() {
  const spinner = ora({
    text: chalk.blue('Checking for updates...'),
    spinner: 'dots12',
    color: 'cyan'
  }).start();

  try {
    const { stdout } = await execAsync('npm outdated');
    if (!stdout) {
      spinner.succeed(
        chalk.green.bold('All packages are up to date!') + '\n' +
        chalk.cyan('You\'re running the latest version.')
      );
    } else {
      spinner.info(chalk.yellow.bold('Updates available:'));
      console.log(gradient.rainbow(stdout));
    }
  } catch (error) {
    spinner.fail(chalk.red.bold('Failed to check updates'));
    console.error(chalk.red(error.message));
  }
}

export async function openDocs() {
  const spinner = ora({
    text: chalk.blue('Opening documentation...'),
    spinner: 'dots12',
    color: 'cyan'
  }).start();

  try {
    await execAsync('xdg-open https://github.com/MTXPr0ject/mtx-pdf-editor#readme');
    spinner.succeed(chalk.green.bold('Documentation opened in browser'));
  } catch (error) {
    spinner.fail(chalk.red.bold('Failed to open documentation'));
    console.log(
      chalk.yellow('Please visit:') + '\n' +
      chalk.blue.underline('https://github.com/MTXPr0ject/mtx-pdf-editor#readme')
    );
  }
}