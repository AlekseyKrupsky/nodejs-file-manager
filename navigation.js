import { readdir } from 'node:fs/promises';
import { chdir, cwd } from 'node:process';
import { printOperationFailed } from "./messages.js";

const list = async () => {
    await readdir(cwd()).then((files) => {
        files.forEach(file => console.log(file));
    }).catch(() => {
        printOperationFailed();
    });
};

const changeDir = (args) => {
    try {
        chdir(args[0]);
    } catch (error) {
        printOperationFailed();
    }
};

const dirUp = () => {
    changeDir(['..']);
};

export { list, changeDir, dirUp };