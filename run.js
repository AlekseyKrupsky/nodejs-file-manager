import process from "node:process";
import { printWelcome, printCurrentDir } from './messages.js';
import os from "node:os";

export const runInit = () => {
    const args = process.argv.slice(2);

    let username = '';

    args.forEach((arg) => {
        if (arg.startsWith('--username=')) {
            username = arg.split('=')[1];
        }
    });

    if (!username) {
        console.log('Username wasn\'t provided. Please provide username using --username argument');

        process.exit(1);
    }

    global.username = username;

    printWelcome();

    process.chdir(os.homedir());

    printCurrentDir();
};
