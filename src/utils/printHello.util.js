import { EOL } from 'node:os';

export const printHello = (username) => {
  process.stdout.write(`Welcome to the File Manager, ${username}!${EOL}`)
}
