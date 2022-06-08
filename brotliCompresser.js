import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { printOperationFailed } from "./messages.js";

const COMPRESS_TYPE = 'compress';
const DECOMPRESS_TYPE = 'decompress';

const action = (type, pathToSourceFile, pathToDestinationFile) => {
    let brotliHandler;

    if (COMPRESS_TYPE === type) {
        brotliHandler = createBrotliCompress();
    } else {
        brotliHandler = createBrotliDecompress();
    }

    const source = createReadStream(pathToSourceFile);
    const destination = createWriteStream(pathToDestinationFile);

    pipeline(source, brotliHandler, destination, (err) => {
        if (err) {
            printOperationFailed();
        }
    });
};

const compress = async ([pathToSourceFile, pathToDestinationFile]) => {
    action(COMPRESS_TYPE, pathToSourceFile, pathToDestinationFile);
};

const decompress = async ([pathToSourceFile, pathToDestinationFile]) => {
    action(DECOMPRESS_TYPE, pathToSourceFile, pathToDestinationFile);
};

export { compress, decompress };