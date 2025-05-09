import { EOL } from 'node:os';
import {
  createReadStream as fsCreateReadStream,
  createWriteStream as fsCreateWriteStream
} from 'node:fs';
import {
  writeFile as fsPromisesWriteFile,
  mkdir as fsPromisesMkdir,
  rename as fsPromisesRename,
  rm as fsPromisesRm,
  stat as fsPromisesStat
} from 'node:fs/promises';

import utilsModule from './7-utils.module.js';

const readFileByStream = async (cwd, filePath) => {
  return await new Promise((resolve, reject) => {
    const targetFilePath = utilsModule.pathResolveCustom(cwd, filePath);
    const streamReader = fsCreateReadStream(targetFilePath);

    process.stdout.write(EOL);
    streamReader.pipe(process.stdout);

    streamReader.on('error', (_e) => {
      reject(new Error('Operation failed'));
    });

    streamReader.on('end', () => {
      process.stdout.write(EOL);
      resolve();
    });
  });
};

const createFileInCwdByStream = async (cwd, fileName) => {
  checkIfFileNameIsProper(fileName);

  const targetFilePath = utilsModule.pathResolveCustom(cwd, fileName);
  const targetFileExists = await checkIfFileExists(targetFilePath);

  if (targetFileExists) {
    throw new Error('Operation failed');
  }

  return await new Promise((resolve, reject) => {
    const streamWriter = fsCreateWriteStream(targetFilePath, { flag: 'wx' });

    streamWriter.on('error', (_e) => {
      reject(new Error('Operation failed'));
    });

    streamWriter.on('finish', () => {
      resolve();
    });

    streamWriter.end();
  });
}

const _createFileInCwd = async (cwd, fileName) => {
  try {
    checkIfFileNameIsProper(fileName);
    const targetFilePath = utilsModule.pathResolveCustom(cwd, fileName);
    await fsPromisesWriteFile(targetFilePath, '', { encoding: 'utf-8', flag: 'wx' });
  } catch (e) {
    throw new Error('Operation failed');
  }
};

const createDirInCwd = async (cwd, dirName) => {
  try {
    const targetDirPath = utilsModule.pathResolveCustom(cwd, dirName);
    await fsPromisesMkdir(targetDirPath, { recursive: true });
  } catch (e) {
    throw new Error('Operation failed');
  }
};

const _renameFile = async (cwd, sourceFilePath, targetFilePath) => {
  try {
    checkIfFileNameIsProper(sourceFilePath.split('/')?.at(-1));
    checkIfFileNameIsProper(targetFilePath.split('/')?.at(-1));

    const srcFilePath = utilsModule.pathResolveCustom(cwd, sourceFilePath);
    const destFilePath = utilsModule.pathResolveCustom(cwd, targetFilePath);

    await fsPromisesRename(srcFilePath, destFilePath);
  } catch (e) {
    throw new Error('Operation failed');
  }
};

const copyFileByStream = async (cwd, sourceFilePath, targetFilePath) => {
  return await new Promise((resolve, reject) => {
    const srcFilePath = utilsModule.pathResolveCustom(cwd, sourceFilePath);
    const destFilePath = utilsModule.pathResolveCustom(cwd, targetFilePath);

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
    if (sourceFilePath !== targetFilePath) {
      await copyFileByStream(cwd, sourceFilePath, targetFilePath);
      await deleteFile(cwd, sourceFilePath);
    }
  } catch (e) {
    throw new Error('Operation failed');
  }
};

const deleteFile = async (cwd, filePath) => {
  try {
    const targetFilePath = utilsModule.pathResolveCustom(cwd, filePath);
    await fsPromisesRm(targetFilePath);
  } catch (e) {
    throw new Error('Operation feailed');
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

const checkIfFileExists = async (filePath) => {
  let fileExists = false;

  try {
    const stats = await fsPromisesStat(filePath);
    if (stats.isFile()) {
      fileExists = true;
    }
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  } finally {
    return fileExists;
  }
};

export default {
  readFileByStream,
  // _createFileInCwd,
  createFileInCwdByStream,
  createDirInCwd,
  // _renameFile,
  copyFileByStream,
  moveFileByStream,
  deleteFile
}
