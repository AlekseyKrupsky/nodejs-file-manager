import { createReadStream, createWriteStream, access, constants, cp, rename as renameFile } from 'node:fs';
import { stat, rm } from 'node:fs/promises';
import { operationFailed } from "./messages.js";
import path from 'node:path';

const read = async ([filepath]) => {
    createReadStream(filepath, { encoding: 'utf-8' })
        .on('error', () => {
            operationFailed();
        })
        .on('data', (fileContent) => {
            console.log(fileContent);
        });
};

const write = async ([filename]) => {
    createWriteStream(filename, { flags: 'wx' })
        .on('error', () => {
            operationFailed();
        })
        .end('');
};

const rename = async ([filepath, newFileName]) => {
    const pathSeparator = path.sep;

    if (newFileName.search(pathSeparator) !== -1) {
        operationFailed();

        return;
    }

    let isDir = false;

    try {
        await stat(filepath).then((stats) => {
            isDir = stats.isDirectory();
        });

        if (isDir) {
            throw new Error('It is directory');
        }
    } catch (error) {
        operationFailed();

        return;
    }

    const splittedFilePath = filepath.split(pathSeparator);

    splittedFilePath.pop();
    splittedFilePath.push(newFileName);

    const newFilePath = splittedFilePath.join(pathSeparator);

    access(newFilePath, constants.F_OK, (accessError) => {
        if (null === accessError) {
            operationFailed();

            return;
        }

        renameFile(filepath, newFilePath, ((renameError) => {
            if (null !== renameError) {
                operationFailed();
            }
        }));
    });
};

const copy = async ([pathToFile, pathToNewDirectory]) => {
    const pathSeparator = path.sep;

    const fileName = pathToFile.split(pathSeparator).pop();
    const splittedNewDirectoryPath = pathToNewDirectory.split(pathSeparator);
    splittedNewDirectoryPath.push(fileName);

    const newFilePath = splittedNewDirectoryPath.join(pathSeparator);

    cp(pathToFile, newFilePath, { force: false, errorOnExist: true }, (error) => {
        if (null !== error) {
            operationFailed();
        }
    });
};

const move = async ([pathToFile, pathToNewDirectory]) => {
    const pathSeparator = path.sep;

    // if (newFileName.search(pathSeparator) !== -1) {
    //     operationFailed();
    //
    //     return;
    // }

    let isDir = false;

    try {
        await stat(pathToFile).then((stats) => {
            isDir = stats.isDirectory();
        });

        if (isDir) {
            throw new Error('It is directory');
        }
    } catch (error) {
        operationFailed();

        return;
    }

    const splittedFilePath = pathToFile.split(pathSeparator);

    const fileName = splittedFilePath.pop();

    const splittedNewDirectoryPath = pathToNewDirectory.split(pathSeparator);

    splittedNewDirectoryPath.push(fileName);

    const newFilePath = splittedNewDirectoryPath.join(pathSeparator);
        // const newFilePath = splittedFilePath.join(pathSeparator);

    // console.log(pathToFile);
    // console.log(splittedNewDirectoryPath);


    access(newFilePath, constants.F_OK, (accessError) => {
        if (null === accessError) {
            operationFailed();

            return;
        }

        renameFile(pathToFile, newFilePath, ((renameError) => {
            if (null !== renameError) {
                operationFailed();
            }
        }));
    });
};

const remove = async ([pathToFile]) => {
    await rm(pathToFile).catch(() => {
        operationFailed();
    });
};

export { read, write, rename, copy, move, remove };