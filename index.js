import process, {chdir, cwd, stdin, stdout} from 'node:process';
import os from 'node:os';
import readline from 'node:readline';
import { changeDir, dirUp, list } from './navigation.js';
import { read } from './files.js';

const AVAILABLE_COMMANDS_METHODS_MAP = {
    up: dirUp,
    cd: changeDir,
    ls: list,
    cat: read,
    'add': null,
    'rn': null,
    'cp': null,
    'mv': null,
    'rm': null,
    'os': null,
    'hash': null,
    'compress': null,
    'decompress': null,
};

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

console.log(`Welcome to the File Manager, ${username}!`);

// process.on('exit', () => {
//     console.log(`Thank you for using File Manager, ${username}!`);
// });

const rl = readline.createInterface(stdin, stdout);

process.on('SIGINT', () => {
    // rl.close();
    throw new Error('1231');

    console.log(`Thank you for using File Manager, ${username}!`);
    process.exit();
});

chdir(os.homedir());

console.log(`You are currently in ${cwd()}`);


rl.on('line', (command) => {
    const commandParts = command.split(' ');
    const masterCommand = commandParts.splice(0, 1);

    if (AVAILABLE_COMMANDS_METHODS_MAP[masterCommand] !== undefined) {
        AVAILABLE_COMMANDS_METHODS_MAP[masterCommand](commandParts);

        console.log(`You are currently in ${cwd()}`);
    } else {
        console.log('Invalid input');
    }
});

// process.stdin.pipe(process.stdout);



// const answer = await rl.line