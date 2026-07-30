import chalk from 'chalk';
import type { Color } from '@/ui/print/models/Color.ts';

export function print(text: string, color: Color = 'white') {
    switch (color) {
        case 'white':
            return console.log(chalk.white(text));
        case 'blue':
            return console.log(chalk.blue(text));
        case 'red':
            return console.log(chalk.red(text));
        case 'green':
            return console.log(chalk.green(text));
    }
}
