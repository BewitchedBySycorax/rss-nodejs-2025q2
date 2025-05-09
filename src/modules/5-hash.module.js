import { createHash as cryptoCreateHash } from 'node:crypto';
import { createReadStream as fsCreateReadStream } from 'node:fs';
import { EOL } from 'node:os';

import utilsModule from './7-utils.module.js';

const calculateHash = async (cwd, filePath) => {
  return await new Promise((resolve, reject) => {
    const targetFilePath = utilsModule.pathResolveCustom(cwd, filePath);
    const streamReader = fsCreateReadStream(targetFilePath);

    const hash = cryptoCreateHash('sha256');

    streamReader.on('error', (_e) => {
      reject(new Error('Operation failed'));
    });

    streamReader.on('data', (chunk) => {
      hash.update(chunk);
    });

    streamReader.on('end', () => {
      const hex = hash.digest('hex');
      resolve(hex);
    });
  });
};

export default {
  calculateHash
}
