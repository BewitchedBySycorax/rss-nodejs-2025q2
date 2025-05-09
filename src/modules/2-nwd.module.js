import { readdir as fsPromisesReaddir } from 'node:fs/promises';

import utilsModule from './7-utils.module.js';

/**
 * 8. User can't go upper than root directory (e.g. on Windows it's current local drive root).
 *    If user tries to do so, current working directory doesn't change
 */
const changeDir = (cwd, changeDirPath = '../') => {
  try {
    const changeDirPathNormalized = utilsModule.pathResolveCustom(cwd, changeDirPath);
    process.chdir(changeDirPathNormalized);

    return changeDirPathNormalized;
  } catch {
    throw new Error('Operation failed');
  }
}

const ls = async (cwd) => {
  try {
    const cwdContent = await fsPromisesReaddir(cwd, { withFileTypes: true });

    const cwdContentExtended = cwdContent.map((cwdEntry) => ({
      Name: cwdEntry.name,
      Type: !cwdEntry.isDirectory() ? 'file' : 'directory'
    }));

    const cwdContentSorted = [...cwdContentExtended]
      .sort((a, b) => {
        const sortedByType = a.Type.localeCompare(b.Type);
        if (sortedByType) {
          return sortedByType;
        } else {
          const sortedByName = a.Name.localeCompare(b.Name);
          return sortedByName;
        }
      });

    console.table(cwdContentSorted);
  } catch (e) {
    throw new Error('Operation failed');
  }
}

export default {
  changeDir,
  ls
}
