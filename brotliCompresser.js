import { createWriteStream } from 'node:fs';
import { open } from 'node:fs/promises';
import { pipeline } from 'node:stream';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { argsCountValidator } from "./argsValidator.js";
import { OPERATIONS_FAILED } from "./errors.js";
import { checkIsDirectory, generateNewFilePath } from "./filesOperations.js";

const COMPRESS_TYPE = 'compress';
const DECOMPRESS_TYPE = 'decompress';

const action = async (type, args) => {
    argsCountValidator(args, 2);

    const [pathToSourceFile, pathToDestination] = args;

    await checkIsDirectory(pathToSourceFile);

    let brotliHandler;
    let newFilePath;

    if (COMPRESS_TYPE === type) {
        newFilePath = generateNewFilePath(pathToSourceFile, pathToDestination) + '.br';
        brotliHandler = createBrotliCompress();
    } else {
        newFilePath = generateNewFilePath(pathToSourceFile, pathToDestination).slice(0, -3);
        brotliHandler = createBrotliDecompress();
    }

    const sourceFd = await open(pathToSourceFile);

    const source = sourceFd.createReadStream();
    const destination = createWriteStream(newFilePath, {flags: 'wx'});

    return new Promise((resolve, reject) => {
        pipeline(source, brotliHandler, destination, (err) => {
            if (err) {
                reject(OPERATIONS_FAILED);
            }

            resolve();
        });
    });
};

const compress = async (args) => {
    await action(COMPRESS_TYPE, args);
};

const decompress = async (args) => {
    await action(DECOMPRESS_TYPE, args);
};

export { compress, decompress };