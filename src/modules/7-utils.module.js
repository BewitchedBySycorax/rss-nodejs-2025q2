import { EOL } from 'node:os';
import { homedir } from 'node:os';
import { join as pathJoin, resolve as pathResolve } from 'node:path';

const printToConsole = (data, isError = false) => {
  const processOut = !isError ? process.stdout : process.stderr;
  processOut.write(`${EOL}${data}${EOL}`);
}

const getCliUsername = () => {
  let username = null;
  username = process.argv.find(arg => arg.startsWith('--username='))?.split('=').at(-1);
  if (!username) username = process.env.npm_config_username; // https://www.golinuxcloud.com/pass-arguments-to-npm-script/
  return username;
}

const pathResolveCustom = (cwd, _path) => {
  let path = '' 
  if (_path.startsWith('~')) {
    path = pathJoin(homedir(), _path.slice(1));
  } else {
    path = pathResolve(cwd, _path);
  }
  return path;
}

export default {
  getCliUsername,
  printToConsole,
  pathResolveCustom
}
