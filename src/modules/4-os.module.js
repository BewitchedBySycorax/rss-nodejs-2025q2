import { EOL, homedir, cpus, userInfo, arch } from 'node:os';

/**
 * 4. Starting working directory is current user's home directory
 *    (for example, on Windows it's something like system_drive/Users/Username)
 */
const getCwd = () => homedir;
const getEol = () => EOL;

const getCpusInfo = () => {
  const rawCpusInfo = cpus();

  const cpusInfo = {
    overallCpusAmount: rawCpusInfo.length,
    cpusInfo: rawCpusInfo.map((cpu, index) => ({
      id: index + 1,
      model: cpu.model.trim(),
      speedGHz: +(cpu.speed / 1000).toFixed(2)
    }))
  };

  return cpusInfo;
};

const getHomedir = () => getCwd();
const getUsername = () => userInfo().username;
const getArch = () => arch();

export default {
  getCwd,
  getEol,
  getCpusInfo,
  getHomedir,
  getUsername,
  getArch
}
