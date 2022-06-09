import { cwd } from "node:process";
import os from "node:os";

class MessagePrinter {
    setReadline = (rl) => {
        this.rl = rl;
    };

    setUserName = (username) => {
        this.username = username;
    };

    printInvalidInput = () => {
        console.log('Invalid input');
    };

    printOperationFailed = () => {
        console.log('Operation failed');
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
        this.rl.setPrompt(`${cwd()} >> `);
        this.rl.prompt();
    };
}

export default new MessagePrinter();