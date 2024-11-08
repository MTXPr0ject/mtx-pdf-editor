import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';

const execAsync = promisify(exec);

export async function startEditor() {
  const spinner = ora('Starting PDF Editor...').start();
  try {
    await execAsync('npm run dev');
    spinner.succeed(chalk.green('PDF Editor started successfully!'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to start PDF Editor'));
    console.error(error.message);
  }
}

export async function checkUpdates() {
  const spinner = ora('Checking for updates...').start();
  try {
    const { stdout } = await execAsync('npm outdated');
    if (!stdout) {
      spinner.succeed(chalk.green('All packages are up to date!'));
    } else {
      spinner.info(chalk.yellow('Updates available:'));
      console.log(stdout);
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to check updates'));
    console.error(error.message);
  }
}

export async function openDocs() {
  const spinner = ora('Opening documentation...').start();
  try {
    await execAsync('xdg-open https://github.com/MTXPr0ject/mtx-pdf-editor#readme');
    spinner.succeed(chalk.green('Documentation opened in browser'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to open documentation'));
    console.log(chalk.yellow('Visit: https://github.com/MTXPr0ject/mtx-pdf-editor#readme'));
  }
}