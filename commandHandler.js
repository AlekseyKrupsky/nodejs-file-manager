import { changeDir, dirUp, list } from './navigation.js';
import { read, write, rename, copy, move, remove } from './filesOperations.js';
import { operationSystem } from './os.js';
import { hash } from './hash.js';
import { compress, decompress } from "./brotliCompresser.js";
import { exitManager } from "./exit.js";
import messagePrinter from "./messages.js";
import readline from "node:readline";
import { stdin, stdout } from "node:process";
import { INVALID_INPUT } from "./errors.js";

const AVAILABLE_COMMANDS_METHODS_MAP = {
    up: dirUp,
    cd: changeDir,
    ls: list,
    cat: read,
    add: write,
    rn: rename,
    cp: copy,
    mv: move,
    rm: remove,
    os: operationSystem,
    hash: hash,
    compress: compress,
    decompress: decompress,
    '.exit': exitManager,
};

const executeCommand = async (command, args) => {
    await AVAILABLE_COMMANDS_METHODS_MAP[command](args)
        .catch((error) => {
            if (error.message === INVALID_INPUT) {
                messagePrinter.printInvalidInput();
            } else {
                messagePrinter.printOperationFailed();
            }
        });
};

export const runLineReader = () => {
    const rl = readline.createInterface(stdin, stdout);

    messagePrinter.setReadline(rl);
    messagePrinter.printPrompt();

    rl.on('line', async (fullCommand) => {
        if (fullCommand === '') {
            messagePrinter.printPrompt();

            return;
        }

        const [command, ...args] = fullCommand.split(' ');

        if (AVAILABLE_COMMANDS_METHODS_MAP[command] !== undefined) {
            await executeCommand(command, args);
        } else {
            messagePrinter.printInvalidInput();
        }

        messagePrinter.printCurrentDir();
        messagePrinter.printPrompt();
    }).on('close', () => {
        messagePrinter.printThankYou();
    });
};
