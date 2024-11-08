import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';

export function showWelcome() {
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
}

export function showSuccess(message) {
  console.log(
    boxen(chalk.green(message), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green'
    })
  );
}

export function showError(message) {
  console.log(
    boxen(chalk.red(message), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'red'
    })
  );
}

export function showExit() {
  console.log(gradient.rainbow('\nThank you for using MTX PDF Editor!\n'));
}

//this file is made by the author: MrTomXxX
//github.com/MrTomXxX
