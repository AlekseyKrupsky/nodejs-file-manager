import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { printOperationFailed } from "./messages.js";

export const hash = async ([pathToFile]) => {
    let fileContent = '';

    const readStream = createReadStream(pathToFile, { encoding: 'utf-8' })
        .on('error', () => {
            printOperationFailed();
        })
        .on('data', (content) => {
            fileContent += content;
        })
        .on('end', () => {
            const hash = createHash('sha256');
            hash.update(fileContent);

            console.log(`Hex hash: ${hash.digest('hex')}`);

            readStream.close();
        });
};