import { EOL, homedir } from 'node:os';

/**
 * 4. Starting working directory is current user's home directory
 *    (for example, on Windows it's something like system_drive/Users/Username)
 */
const getCwd = () => homedir;

const printCwd = (cwd) => {
  process.stdout.write(`You are currently in ${cwd}${EOL}`);
}

export default {
  getCwd,
  printCwd
}
