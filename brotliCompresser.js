import { createWriteStream } from 'node:fs';
import { open } from 'node:fs/promises';
import { pipeline } from 'node:stream';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { printOperationFailed } from "./messages.js";

const COMPRESS_TYPE = 'compress';
const DECOMPRESS_TYPE = 'decompress';

const action = async (type, pathToSourceFile, pathToDestinationFile) => {
    let brotliHandler;

    if (COMPRESS_TYPE === type) {
        brotliHandler = createBrotliCompress();
    } else {
        brotliHandler = createBrotliDecompress();
    }

    try {
        const sourceFd = await open(pathToSourceFile);

        const source = sourceFd.createReadStream();
        const destination = createWriteStream(pathToDestinationFile, { flags: 'wx' });

        pipeline(source, brotliHandler, destination, (err) => {
            if (err) {
                printOperationFailed();
            }
        });
    } catch (error) {
        printOperationFailed();
    }
};

const compress = async ([pathToSourceFile, pathToDestinationFile]) => {
    await action(COMPRESS_TYPE, pathToSourceFile, pathToDestinationFile);
};

const decompress = async ([pathToSourceFile, pathToDestinationFile]) => {
    await action(DECOMPRESS_TYPE, pathToSourceFile, pathToDestinationFile);
};

export { compress, decompress };