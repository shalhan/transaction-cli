import express from 'express';
import { authCtrl, transactionCtrl, transactionSvc } from './di';
import readline from 'readline';

const app = express();
const port = 3022;


app.listen(port, () => {
  console.log("app running...");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const session = {}

  const commands = {
      login: async (username: string) => {
        await authCtrl.login(username);
        session["username"] = username; 
      },
      transfer: async (to: string, amount: number) => {
        if (Object.keys(session).length == 0 || session["username"] == "") {
          console.error('unauthorized');
          return;
        }
        await transactionCtrl.transfer(session["username"], to, amount);
      },
      deposit: async (amount: number) => {
        if (Object.keys(session).length == 0 || session["username"] == "") {
          console.error('unauthorized');
          return;
        }
        await transactionCtrl.deposit(session["username"], amount);
      },
      logout: () => {
          console.log(`Goodbye, ${session["username"]}!`);
          Object.assign(session, {})
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
