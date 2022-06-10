import { cwd } from "node:process";
import os from "node:os";

const COLORS = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
}

class MessagePrinter {
    setReadline = (rl) => {
        this.rl = rl;
    };

    setUserName = (username) => {
        this.username = username;
    };

    printInvalidInput = () => {
        console.log(COLORS.red, 'Invalid input');
    };

    printOperationFailed = () => {
        console.log(COLORS.red, 'Operation failed');
    };

    printWelcome = () => {
        console.log(`Welcome to the File Manager, ${this.username}!`);
    };

    printCurrentDir = () => {
        console.log(`You are currently in ${cwd()}`);
    };

    printThankYou = () => {
        const firstSymbol = this.rl.closed ? os.EOL : '';

        console.log(`${firstSymbol}Thank you for using File Manager, ${this.username}!`);
    };

    printPrompt = () => {
        this.rl.setPrompt(`${COLORS.green.replace('%s', cwd())} >> `);
        this.rl.prompt();
    };
}

export default new MessagePrinter();