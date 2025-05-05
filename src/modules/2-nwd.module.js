import { resolve as pathResolve } from 'node:path';
import { readdir as fsPromisesReaddir } from 'node:fs/promises';

import { pathResolveCustom } from '../utils/pathResolveCustom.util.js';

const up = () => {
  try {
    process.chdir('../');
    return process.cwd();
  } catch {
    throw new Error('Operation failed');
  }
}

const cd = (cwd, changeDirPath) => {
  try {
    // console.log(17, cwd);
    // console.log(18, changeDirPath);

    // const changeDirPath = pathResolve(cwd, changeDirPath);

    // console.log(22, changeDirPath);

    const changeDirPathNormalized = pathResolveCustom(cwd, changeDirPath);

    console.log(26, changeDirPathNormalized);
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
    // if (e?.code === 'ENOENT') {
      throw new Error('Operation failed');
    // }
  }
}

export default {
  up,
  cd,
  ls
}
