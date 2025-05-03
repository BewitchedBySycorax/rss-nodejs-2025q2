/**
 * calcHash.js - implement function that calculates SHA256 hash for file fileToCalculateHashFor.txt
 * and logs it into console as hex using Streams API
 */

import { createHash as cryptoCreateHash } from 'node:crypto';
import { readFile as fsPromisesReadFile } from 'node:fs/promises';
import { EOL } from 'node:os';
import { fileURLToPath } from 'node:url';
import {
    dirname as pathDirname,
    resolve as pathResolve
} from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const filePath = pathResolve(__dirname, 'files', 'fileToCalculateHashFor.txt');

const calculateHash = async () => {
    try {
        const fileData = await fsPromisesReadFile(filePath);

        const hash = cryptoCreateHash('sha256');
        hash.update(fileData);
        const hex = hash.digest('hex');
    
        process.stdout.write(hex + EOL);
    } catch (e) {
        process.stderr.write(e.message + EOL);
    }
};

await calculateHash();