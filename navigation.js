import { readdir } from 'node:fs/promises';
import { chdir, cwd } from 'node:process';
import { argsCountValidator } from "./argsValidator.js";

const list = async (args) => {
    argsCountValidator(args, 0);

    await readdir(cwd()).then((files) => {
        files.forEach(file => console.log(file));
    });
};

const changeDir = async (args) => {
    argsCountValidator(args, 1);

    const [destinationDir] = args;

    chdir(destinationDir);
};

const dirUp = async (args) => {
    argsCountValidator(args, 0);

    await changeDir(['..']);
};

export { list, changeDir, dirUp };