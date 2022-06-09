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

    const pathSeparator = path.sep;

    if (newFileName.search(pathSeparator) !== -1) {
        throw new Error(OPERATIONS_FAILED);
    }

    const splittedFilePath = pathToFile.split(pathSeparator);

    splittedFilePath.pop();
    splittedFilePath.push(newFileName);

    const newFilePath = splittedFilePath.join(pathSeparator);

    return getRenamePromise(pathToFile, newFilePath);
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
    const pathSeparator = path.sep;
    const fileName = pathToFile.split(pathSeparator).pop();
    const splittedNewDirectoryPath = pathToNewDirectory.split(pathSeparator);

    splittedNewDirectoryPath.push(fileName);

    return splittedNewDirectoryPath.join(pathSeparator);
};

export { read, write, rename, copy, move, remove };