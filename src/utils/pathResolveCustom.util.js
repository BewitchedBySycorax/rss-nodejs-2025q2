import { homedir as osHomedir } from 'node:os';
import { join as pathJoin, resolve as pathResolve } from 'node:path';

export const pathResolveCustom = (cwd, _path) => {
  let path = '' 
  if (_path.startsWith('~')) {
    path = pathJoin(osHomedir(), _path.slice(1));
  } else {
    path = pathResolve(cwd, _path);
  }
  return path;
}
