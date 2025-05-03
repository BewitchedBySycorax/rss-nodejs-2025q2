import { EOL } from 'node:os';

export const exitProgram = (username, exitCode = 0) => {
  process.stdout.write(`${EOL}Thank you for using File Manager, ${username}, goodbye!${EOL}`);
  process.exit(exitCode);
}
