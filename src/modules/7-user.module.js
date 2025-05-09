import { EOL } from 'node:os';

const getUsername = () => {
  let username = null;
  username = process.argv.find(arg => arg.startsWith('--username='))?.split('=').at(-1);
  if (!username) username = process.env.npm_config_username; // https://www.golinuxcloud.com/pass-arguments-to-npm-script/
  return username;
}

const printHello = (username) => {
  process.stdout.write(`Welcome to the File Manager, ${username}!${EOL}`)
}

export default {
  getUsername,
  printHello
}
