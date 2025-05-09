// TODO:
// ? Error hanlder (7th) module?
// ? README.md
//    The program is started by npm-script start in following way: npm run start -- --username=your_username
// ?? Refactor SWITCH/CASE to corresponding maps
// ??? Print after start some help for commands description (maybe 'help' command and message previously?)
// TODO:

import { EOL } from 'node:os';
import readline from 'node:readline';

import nwdModule from './2-nwd.module.js'
import filesModule from './3-files.module.js';
import osModule from './4-os.module.js';
import hashModule from './5-hash.module.js';
import zipModule from './6-zip.module.js';
import userModule from './7-user.module.js';

/**
 * 0. Preliminary
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const start = () => {
  const username = userModule.getUsername();
  let cwd = osModule.getCwd()(); // 4. Look at the function implementation

  /**
   * 2. After program work finished (ctrl + c pressed or user sent .exit command into console) the program
   *    displays the following text in the console: 'Thank you for using File Manager, Username, goodbye!'
   */
  rl.on('close', () => {
    process.stdout.write(`${EOL}Thank you for using File Manager, ${username}, goodbye!${EOL}`);
    process.exit(0);
  });

  /**
   * 1. After starting the program displays the following text in the console
   *    (Username is equal to value that was passed on application start in --username CLI argument):
   *    'Welcome to the File Manager, Username!'
   */
  userModule.printHello(username);

  /**
   * 3. At the start of the program and after each end of input/operation current working directory
   *    should be printed in following way: 'You are currently in path_to_working_directory'
   * 
   * 4. Starting working directory is current user's home directory (for example, on Windows it's something like system_drive/Users/Username)
   */
  osModule.printCwd(cwd);

  /**
   * 5. By default program should prompt user in console to print commands and wait for results
   */
  rl.prompt();

  rl.on('line', async (line) => {
    try {
      // const [command, ...args] = line.trim().split(' '); // split by 1 space
      const [command, ...args] = line.trim().split(/\s+/); // split by N spaces

      /**
       * 9. List of operations and their syntax:
       */
      switch (command) {
        /**
         * 2. After program work finished (ctrl + c pressed or user sent .exit command into console) the program
         *    displays the following text in the console: 'Thank you for using File Manager, Username, goodbye!'
         */
        case '.exit':
          rl.close();
          break;

        /**
         * 9.1. Navigation & working directory (nwd)
         */
        case 'up':
          /**
           * 9.1.1. Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
           * 
           *        up
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length) {
            throw new Error('Invalid input');
          }

          // cwd = nwdModule.up(cwd);
          cwd = nwdModule.changeDir(cwd);
          break;
        case 'cd':
          /**
           * 9.1.2. Go to dedicated folder from current directory (path_to_directory can be relative or absolute)
           * 
           *        cd path_to_directory
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length !== 1) {
            throw new Error('Invalid input');
          }

          // cwd = nwdModule.cd(cwd, args[0]);
          cwd = nwdModule.changeDir(cwd, args[0]);
          break;
        case 'ls':
          /**
           * 9.1.3. Print in console list of all files and folders in current directory. List should contain:
           *        — list should contain files and folder names (for files - with extension)
           *        — folders and files are sorted in alphabetical order ascending, but list of folders goes first
           *        — type of directory content should be marked explicitly (e.g. as a corresponding column value)
           * 
           *        ls
           * 
           *        Example of how ls command output may look like result of console.table() command
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length) {
            throw new Error('Invalid input');
          }

          await nwdModule.ls(cwd);
          break;

        /**
         * 9.2. Basic operations with files
         */
        case 'cat':
          /**
           * 9.2.1. Read file and print it's content in console (should be done using Readable stream):
           * 
           *        cat path_to_file
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length !== 1) {
            throw new Error('Invalid input');
          }

          await filesModule.readFileByStream(cwd, args[0]);
          break;
        case 'add':
          /**
           * 9.2.2. Create empty file in current working directory:
           * 
           *        add new_file_name
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length !== 1) {
            throw new Error('Invalid input');
          }

          await filesModule.createFileInCwd(cwd, args[0]);
          break;
        case 'mkdir':
          /**
           * 9.2.3. Create new directory in current working directory:
           * 
           *        mkdir new_directory_name
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length !== 1) {
            throw new Error('Invalid input');
          }

          await filesModule.createDirInCwd(cwd, args[0]);
          break;
        case 'rn':
          /**
           * 9.2.4. Rename file (content should remain unchanged):
           * 
           *        rn path_to_file new_filename
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length !== 2) {
            throw new Error('Invalid input');
          }

          await filesModule.renameFile(cwd, args[0], args[1]);
          break;
        case 'cp':
          /**
           * 9.2.5. Copy file (should be done using Readable and Writable streams):
           * 
           *        cp path_to_file path_to_new_directory
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length !== 2) {
            throw new Error('Invalid input');
          }

          await filesModule.copyFileByStream(cwd, args[0], args[1]);
          break;
        case 'mv':
          /**
           * 9.2.6. Move file (same as copy but initial file is deleted, copying part should be done using Readable and Writable streams):
           * 
           *        mv path_to_file path_to_new_directory
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length !== 2) {
            throw new Error('Invalid input');
          }

          await filesModule.moveFileByStream(cwd, args[0], args[1]);
          break;
        case 'rm':
          /**
           * 9.2.7. Delete file:
           * 
           *        rm path_to_file
           */

          /**
           * 6. In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
           */
          if (args.length !== 1) {
            throw new Error('Invalid input');
          }

          await filesModule.deleteFile(cwd, args[0]);
          break;
        
        /**
         * 9.3. Operating system info (prints following information in console)
         */
        case 'os --EOL':
          // TODO:
          /**
           * 9.3.1. Get EOL (default system End-Of-Line) and print it to console
           * 
           *        os --EOL
           */
          break;
        case 'os --cpus':
          // TODO:
          /**
           * 9.3.2. Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
           * 
           *        os --cpus
           */
          break;
        case 'os --homedir':
          // TODO:
          /**
           * 9.3.3. Get home directory and print it to console
           * 
           *        os --homedir
           */
          break;
        case 'os --username':
          // TODO:
          /**
           * 9.3.4. Get current system user name (Do not confuse with the username that is set when the application starts) and print it to console
           * 
           *        os --username
           */
          break;
        case 'os --architecture':
          // TODO:
          /**
           * 9.3.5. Get CPU architecture for which Node.js binary has compiled and print it to console
           * 
           *        os --architecture
           */
          break;

        /**
         * 9.4. Hash calculation
         */
        case 'hash':
          // TODO:
          /**
           * 9.4.1. Calculate hash for file and print it into console
           * 
           *        hash path_to_file
           */
          break;

        /**
         * 9.5. Compress and decompress operations
         */
        case 'compress':
          // TODO:
          /**
           * 9.5.1. Compress file (using Brotli algorithm, should be done using Streams API)
           * 
           *        compress path_to_file path_to_destination
           */
          break;
        case 'decompress':
          // TODO:
          /**
           * 9.5.2. Decompress file (using Brotli algorithm, should be done using Streams API)
           * 
           *        decompress path_to_file path_to_destination
           * 
           * NB! After decompressing of previously compressed file result should not differ with originally compressed file
           */
          break;

        //

        default:
      }

      /**
       * 3. At the start of the program and after each end of input/operation current working directory
       *    should be printed in following way: 'You are currently in path_to_working_directory'
       * 
       * 4. Starting working directory is current user's home directory (for example, on Windows it's something like system_drive/Users/Username)
       */
      osModule.printCwd(cwd);

      /**
       * 5. By default program should prompt user in console to print commands and wait for results
       */
    } catch (e) {
      console.error(306); // TODO: убрать это
      process.stderr.write(`${e.message}${EOL}`);
    } finally {
      rl.prompt();
    }
  });
};

export default {
  start
}
