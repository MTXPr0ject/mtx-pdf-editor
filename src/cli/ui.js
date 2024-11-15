import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';

const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF'];

export function showWelcome() {
  console.clear();
  
  // Create rainbow title
  const title = figlet.textSync('MTX PDF', {
    font: 'ANSI Shadow',
    horizontalLayout: 'fitted'
  });

  // Create subtitle
  const subtitle = figlet.textSync('EDITOR', {
    font: 'Small',
    horizontalLayout: 'fitted'
  });

  // Print animated welcome message
  console.log('\n' + gradient(rainbowColors).multiline(title));
  console.log(gradient.pastel.multiline(subtitle));

  // Print version and info
  console.log('\n' + boxen(
    chalk.bold('Welcome to MTX PDF Editor CLI') + '\n\n' +
    chalk.blue('Version: ') + chalk.green('1.0.0') + '\n' +
    chalk.blue('Author: ') + chalk.green('MrTomXxX') + '\n' +
    chalk.blue('License: ') + chalk.green('MIT'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      float: 'center'
    }
  ));

  // Print feature list
  console.log(
    boxen(
      chalk.yellow.bold('Features:') + '\n\n' +
      chalk.green('✓ ') + chalk.white('PDF Editing & Annotations\n') +
      chalk.green('✓ ') + chalk.white('Digital Signatures\n') +
      chalk.green('✓ ') + chalk.white('Form Handling\n') +
      chalk.green('✓ ') + chalk.white('AI-Powered Analysis\n') +
      chalk.green('✓ ') + chalk.white('PDF Compression\n') +
      chalk.green('✓ ') + chalk.white('Format Conversion'),
      {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 1, right: 1 },
        borderStyle: 'single',
        borderColor: 'yellow'
      }
    )
  );
}

export function showSuccess(message) {
  console.log(
    boxen(
      chalk.green.bold('✓ SUCCESS') + '\n\n' + 
      chalk.white(message),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
        float: 'center'
      }
    )
  );
}

export function showError(message) {
  console.log(
    boxen(
      chalk.red.bold('✗ ERROR') + '\n\n' + 
      chalk.white(message),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'red',
        float: 'center'
      }
    )
  );
}

export function showExit() {
  const goodbye = figlet.textSync('Goodbye!', {
    font: 'Small',
    horizontalLayout: 'fitted'
  });

  console.log('\n' + gradient.rainbow.multiline(goodbye));
  console.log(
    boxen(
      chalk.cyan.bold('Thanks for using MTX PDF Editor!') + '\n\n' +
      chalk.white('Visit us at: ') + chalk.blue.underline('https://github.com/MTXPr0ject'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan',
        float: 'center'
      }
    )
  );
}

export function showProgress(action, progress) {
  const bar = '█'.repeat(Math.floor(progress * 40));
  const empty = '░'.repeat(40 - Math.floor(progress * 40));
  const percentage = Math.floor(progress * 100);
  
  process.stdout.write(
    `\r${chalk.blue(action)} ${chalk.yellow(`[${bar}${empty}]`)} ${chalk.green(`${percentage}%`)}`
  );
  
  if (progress === 1) {
    process.stdout.write('\n');
  }
}