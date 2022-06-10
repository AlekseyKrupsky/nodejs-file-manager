import {
    createReadStream,
    createWriteStream,
    access,
    constants,
    rename as renameFile
} from 'node:fs';
import { stat, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { argsCountValidator } from "./argsValidator.js";
import { OPERATIONS_FAILED } from "./errors.js";

const read = async (args) => {
    argsCountValidator(args, 1);

    return new Promise((resolve, reject) => {
        const [filepath] = args;

        createReadStream(filepath, { encoding: 'utf-8' })
            .on('data', (fileContent) => {
                console.log(fileContent);
            })
            .on('error', err => reject(err))
            .on('end', () => resolve());
    });
};

const write = async (args) => {
    argsCountValidator(args, 1);

    const [filename] = args;

    if (path.parse(filename).dir !== '') {
        throw new Error(OPERATIONS_FAILED);
    }

    return new Promise((resolve, reject) => {
        createWriteStream(filename, { flags: 'wx' }).end('')
            .on('error', () => {
                reject(OPERATIONS_FAILED);
            })
            .on('close', () => {
                resolve();
            });
    });
};

const rename = async (args) => {
    argsCountValidator(args, 2);

    const [pathToFile, newFileName] = args;

    await checkIsDirectory(pathToFile);

    const formattedPathToFile = path.format(path.parse(pathToFile));

    if (path.parse(newFileName).dir !== '') {
        throw new Error(OPERATIONS_FAILED);
    }

    const splittedFilePath = formattedPathToFile.split(path.sep);

    splittedFilePath.pop();
    splittedFilePath.push(newFileName);

    const newFilePath = splittedFilePath.join(path.sep);

    return getRenamePromise(formattedPathToFile, newFilePath);
};

const copy = async (args) => {
    argsCountValidator(args, 2);

    const [pathToFile, pathToNewDirectory] = args;

    const newFilePath = generateNewFilePath(pathToFile, pathToNewDirectory);

    await cp(pathToFile, newFilePath, { force: false, errorOnExist: true });
};

const move = async (args) => {
    argsCountValidator(args, 2);

    const [pathToFile, pathToNewDirectory] = args;

    await checkIsDirectory(pathToFile);

    const newFilePath = generateNewFilePath(pathToFile, pathToNewDirectory);

    return getRenamePromise(pathToFile, newFilePath);
};

const remove = async (args) => {
    argsCountValidator(args, 1);

    const [pathToFile] = args;

    await rm(pathToFile);
};

const checkIsDirectory = async (filepath) => {
    let isDir = false;

    await stat(filepath).then((stats) => {
        isDir = stats.isDirectory();
    });

    if (isDir) {
        throw new Error(OPERATIONS_FAILED);
    }
};

const getRenamePromise = (pathToFile, newFilePath) => {
    return new Promise((resolve, reject) => {
        access(newFilePath, constants.F_OK, (err) => {
            if (err === null) {
                reject(OPERATIONS_FAILED);
            }

            resolve();
        });
    }).then(() => {
        return new Promise((resolve, reject) => {
            renameFile(pathToFile, newFilePath, ((renameError) => {
                if (null !== renameError) {
                    reject(OPERATIONS_FAILED);
                }

                resolve();
            }));
        });
    });
};

const generateNewFilePath = (pathToFile, pathToNewDirectory) => {
    const formattedPathToFile = path.format(path.parse(pathToFile));

    const fileName = formattedPathToFile.split(path.sep).pop();
    const splittedNewDirectoryPath = pathToNewDirectory.split(path.sep);

    splittedNewDirectoryPath.push(fileName);

    return splittedNewDirectoryPath.join(path.sep);
};

export { read, write, rename, copy, move, remove, checkIsDirectory, generateNewFilePath };