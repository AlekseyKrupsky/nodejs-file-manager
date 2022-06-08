import { createReadStream, createWriteStream, access, constants, cp, rename as renameFile } from 'node:fs';
import { operationFailed } from "./messages.js";

const read = async (args) => {
    createReadStream(args[0], { encoding: 'utf-8' })
        .on('error', () => {
            operationFailed();
        })
        .on('data', (fileContent) => {
            console.log(fileContent);
        });
};

const write = async (args) => {
    createWriteStream(args[0], { flags: 'wx' })
        .on('error', () => {
            operationFailed();
        })
        .end('');
};

const rename = async (args) => {
    const oldFileName = args[0];
    const newFileName = args[1];

    access(newFileName, constants.F_OK, (accessError) => {
        if (null === accessError) {
            operationFailed();

            return;
        }

        renameFile(oldFileName, newFileName, ((renameError) => {
            if (null !== renameError) {
                operationFailed();
            }
        }));
    });
};

const copy = async (args) => {
    const oldFileName = args[0];
    const newFileName = args[1];

    cp(oldFileName, newFileName, { force: false, errorOnExist: true }, (error) => {
        if (null !== error) {
            operationFailed();
        }
    });
};

export { read, write, rename, copy };