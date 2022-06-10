import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { OPERATIONS_FAILED } from "./errors.js";

export const hash = async (args) => {
    const [ pathToFile ] = args;

    let fileContent = '';

    return new Promise((resolve, reject) => {
        const readStream = createReadStream(pathToFile, { encoding: 'utf-8' })
            .on('error', () => {
                reject(OPERATIONS_FAILED);
            })
            .on('data', (content) => {
                fileContent += content;
            })
            .on('end', () => {
                const hash = createHash('sha256');
                hash.update(fileContent);

                console.log(`Hex hash: ${hash.digest('hex')}`);

                readStream.close();
                resolve();
            });
    });
};