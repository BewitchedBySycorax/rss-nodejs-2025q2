import {
  createReadStream as fsCreateReadStream,
  createWriteStream as fsCreateWriteStream
} from 'node:fs';
import {
  brotliCompress as zlibBrotliCompress,
  brotliDecompress as zlibBrotliDecompress,
} from 'node:zlib';
import { pipeline } from 'node:stream/promises';

import utilsModule from './7-utils.module.js';

const compressFileUsingBrotli = async (cwd, sourceFilePath, targetFilePath) => {
  try {
    const srcFilePath = utilsModule.pathResolveCustom(cwd, sourceFilePath);
    const destFilePath = utilsModule.pathResolveCustom(cwd, targetFilePath);

    const streamReader = fsCreateReadStream(srcFilePath);
    const streamWriter = fsCreateWriteStream(`${destFilePath}.br`);

    await pipeline(streamReader, zlibBrotliCompress(), streamWriter);
  } catch {
    throw new Error('Operation failed');
  }
};

const decompressFileUsingBrotli = async (cwd, sourceFilePath, targetFilePath) => {
  try {
    const srcFilePath = utilsModule.pathResolveCustom(cwd, sourceFilePath);
    const destFilePath = utilsModule.pathResolveCustom(cwd, targetFilePath);

    const streamReader = fsCreateReadStream(`${srcFilePath}.br`);
    const streamWriter = fsCreateWriteStream(destFilePath);

    await pipeline(streamReader, zlibBrotliDecompress(), streamWriter);
  } catch {
    throw new Error('Operation failed');
  }
};

export default {
  compressFileUsingBrotli,
  decompressFileUsingBrotli
}
