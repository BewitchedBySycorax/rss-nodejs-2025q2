import { EOL } from 'node:os';
import {
  createReadStream as fsCreateReadStream,
  createWriteStream as fsCreateWriteStream
} from 'node:fs';
import {
  writeFile as fsPromisesWriteFile,
  mkdir as fsPromisesMkdir,
  rename as fsPromisesRename,
  rm as fsPromisesRm
} from 'node:fs/promises';
import { sep as pathSeparator } from 'node:path';

import { pathResolveCustom } from '../utils/pathResolveCustom.util.js';

const readFileByStream = async (cwd, filePath) => {
  return await new Promise((resolve, reject) => {
    const targetFilePath = pathResolveCustom(cwd, filePath);
    const streamReader = fsCreateReadStream(targetFilePath);

    streamReader.pipe(process.stdout);

    streamReader.on('error', (_e) => {
      process.stderr.write(`${_e.message}${EOL}`);
      reject(new Error('Operation failed'));
    });

    streamReader.on('end', () => {
      process.stdout.write(EOL);
      resolve();
    });
  });
};

const createFileInCwd = async (cwd, fileName) => {
  try {
    checkIfFileNameIsProper(fileName);

    await fsPromisesWriteFile(
      `${cwd}${pathSeparator}${fileName}`,
      '',
      {
        encoding: 'utf-8',
        flag: 'wx'
      }
    );
  } catch (e) {
    throw new Error('Operation failed');
  }
};

const createDirInCwd = async (cwd, dirName) => {
  try {
    await fsPromisesMkdir(`${cwd}${pathSeparator}${dirName}`, { recursive: true });
  } catch (e) {
    throw new Error('Operation failed');
  }
};

const renameFile = async (cwd, sourceFilePath, targetFilePath) => {
  try {
    checkIfFileNameIsProper(sourceFilePath.split('/')?.at(-1));
    checkIfFileNameIsProper(targetFilePath.split('/')?.at(-1));

    const srcFilePath = pathResolveCustom(cwd, sourceFilePath);
    const destFilePath = pathResolveCustom(cwd, targetFilePath);

    await fsPromisesRename(srcFilePath, destFilePath);
  } catch (e) {
    throw new Error('Operation failed');
  }
};

const copyFileByStream = async (cwd, sourceFilePath, targetFilePath) => {
  return await new Promise((resolve, reject) => {
    const srcFilePath = pathResolveCustom(cwd, sourceFilePath);
    const destFilePath = pathResolveCustom(cwd, targetFilePath);

    const streamReader = fsCreateReadStream(srcFilePath);
    const streamWriter = fsCreateWriteStream(destFilePath);

    streamReader.pipe(streamWriter);

    streamReader.on('error', (_e) => {
      reject(new Error('Operation failed'));
    });

    streamWriter.on('error', (_e) => {
      reject(new Error('Operation failed'));
    });

    streamWriter.on('finish', () => {
      resolve();
    });
  });
};

const moveFileByStream = async (cwd, sourceFilePath, targetFilePath) => {
  try {
    await copyFileByStream(cwd, sourceFilePath, targetFilePath);
    await deleteFile(sourceFilePath);
  } catch (e) {
    throw new Error('FS operation failed');
  }
};

const deleteFile = async (filePath) => {
  try {
    const targetFilePath = pathResolveCustom(cwd, filePath);
    await fsPromisesRm(targetFilePath);
  } catch (e) {
    throw new Error('FS operation failed');
  }
};

/**
 * Utilities
 */

const invalidFileNameChars = [
  '<', '>', ':',
  '"', '/', '\\',
  '|', '?', '*'
];

const checkIfFileNameIsProper = (fileName) => {
  const restrictedCharExists = invalidFileNameChars.find((char) => fileName.split('').includes(char));

  if (restrictedCharExists) {
    throw new Error('Invalid input');
  }
};

export default {
  readFileByStream,
  createFileInCwd,
  createDirInCwd,
  renameFile,
  copyFileByStream,
  moveFileByStream,
  deleteFile
}
