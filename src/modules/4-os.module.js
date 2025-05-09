import { EOL, homedir, cpus, userInfo, arch } from 'node:os';

/**
 * 4. Starting working directory is current user's home directory
 *    (for example, on Windows it's something like system_drive/Users/Username)
 */
const getCwd = () => homedir;

const printCwd = (cwd) => {
  process.stdout.write(`${EOL}You are currently in ${cwd}${EOL}`);
};

const getEol = () => {
  process.stdout.write(`${EOL}${JSON.stringify(EOL)}${EOL}`);
};

const getCpusInfo = () => {
  const cpuInfo = cpus();

  const formatted = {
    overallCpusAmount: cpuInfo.length,
    cpusInfo: cpuInfo.map((cpu, index) => ({
      id: index + 1,
      model: cpu.model.trim(),
      speedGHz: +(cpu.speed / 1000).toFixed(2)
    }))
  };

  process.stdout.write(`${EOL}${JSON.stringify(formatted, null, 2)}${EOL}`);
};

const printHomedir = () => {
  process.stdout.write(`${EOL}${getCwd()}${EOL}`);
};

const getUsername = () => {
  // os --username
  const { username } = userInfo();
  process.stdout.write(`${EOL}${username}${EOL}`);
};

const getArch = () => {
  process.stdout.write(`${EOL}${arch()}${EOL}`);
};

export default {
  getCwd,
  printCwd,
  getEol,
  getCpusInfo,
  printHomedir,
  getUsername,
  getArch
}
