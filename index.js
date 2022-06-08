import process, { stdin, stdout } from 'node:process';
import readline from 'node:readline';
import { changeDir, dirUp, list } from './navigation.js';
import { read, write, rename, copy, move, remove } from './files.js';
import { operationSystem } from './os.js';
import { hash } from './hash.js';
import { compress, decompress } from "./brotliCompresser.js";
import { exitManager } from "./exit.js";
import { run } from './run.js';
import {printCurrentDir, printThankYou} from "./messages.js";

run();

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

const rl = readline.createInterface(stdin, stdout);

rl.on('line', (command) => {
    const commandParts = command.split(' ');
    const masterCommand = commandParts.splice(0, 1);

    if (AVAILABLE_COMMANDS_METHODS_MAP[masterCommand] !== undefined) {
        AVAILABLE_COMMANDS_METHODS_MAP[masterCommand](commandParts);

        printCurrentDir();
    } else {
        console.log('Invalid input');
    }
}).on('close', () => {
    printThankYou();
});
