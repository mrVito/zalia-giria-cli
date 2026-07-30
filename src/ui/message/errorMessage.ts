import chalk from 'chalk';

export function errorMessage(message: string) {
    console.log(chalk.redBright(`✖ ${message}`));
}
