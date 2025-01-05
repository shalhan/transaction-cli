import express from 'express';
import { authCtrl, transactionCtrl } from './di';
import readline from 'readline';
import { AuthController } from './app/cli/AuthController';

const app = express();
const port = 3022;


app.listen(port, () => {
  console.log("app running... available command (login, logout, deposit, transfer)");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const commands = {
      login: async (username: string) => {
        await authCtrl.login(username);
      },
      transfer: async (to: string, amount: number) => {
        if (AuthController.session["username"] == "") {
          console.error('unauthorized');
          return;
        }
        
        await transactionCtrl.transfer(AuthController.session["username"], to, amount);
      },
      deposit: async (amount: number) => {
        if (AuthController.session["username"] == "") {
          console.error('unauthorized');
          return;
        }
        await transactionCtrl.deposit(AuthController.session["username"], amount);
      },
      logout: () => {
          console.log(`Goodbye, ${AuthController.session["username"]}!`);
          AuthController.session = {};
      },
      exit: () => {
        console.log("EXIT closing app...");

        rl.close();
        process.exit(0);
      }
  };

  const promptUser = () => {
    rl.question('', (input) => {
        const [command, ...args] = input.split(' ');

        if (commands[command]) {
            commands[command](...args);
        } else {
            console.log('Unknown command. Please try again.');
        }

        promptUser(); // Prompt again after processing the command
    }); 
  };

  promptUser();
});
