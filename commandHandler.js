import { changeDir, dirUp, list } from './navigation.js';
import { read, write, rename, copy, move, remove } from './files.js';
import { operationSystem } from './os.js';
import { hash } from './hash.js';
import { compress, decompress } from "./brotliCompresser.js";
import { exitManager } from "./exit.js";
import {printCurrentDir, printInvalidInput, printThankYou} from "./messages.js";
import readline from "node:readline";
import { stdin, stdout } from "node:process";

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

export const runLineReader = () => {
    const rl = readline.createInterface(stdin, stdout);
    rl.setPrompt('>>');
    rl.prompt();

    rl.on('line', async (command) => {
        const commandParts = command.split(' ');
        const masterCommand = commandParts.splice(0, 1);

        if (AVAILABLE_COMMANDS_METHODS_MAP[masterCommand] !== undefined) {
            await AVAILABLE_COMMANDS_METHODS_MAP[masterCommand](commandParts);

            printCurrentDir();
        } else {
            printInvalidInput();
        }
        rl.prompt();
    }).on('close', () => {
        printThankYou();
    });
};
