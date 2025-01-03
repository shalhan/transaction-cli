import { UserRepository } from './adapter/rxdb/UserRepository';
import { UserService } from './core/user/UserService';
import { AuthService } from './core/auth/AuthService';
import { BalanceService } from './core/balance/BalanceService';
import { BalanceRepository } from './adapter/rxdb/BalanceRepository';
import { TransactionService } from './core/transaction/TransactionService';
import { DebitService } from './core/debit/DebitService';
import { DebitRepository } from './adapter/rxdb/DebitRepository';
import { AuthController } from './app/cli/AuthController';
import { TransactionController } from './app/cli/TransactionController';
import { db } from './db';

const userRepo = new UserRepository(db);
const balanceRepo = new BalanceRepository(db);
const debitRepo = new DebitRepository(db);
export const userSvc = new UserService(userRepo);
export const balanceSvc = new BalanceService(balanceRepo);
export const debitSvc = new DebitService(debitRepo);
export const authSvc = new AuthService(userSvc, balanceSvc, debitSvc);
export const transactionSvc = new TransactionService(balanceSvc, debitSvc);
export const authCtrl = new AuthController(authSvc);
export const transactionCtrl = new TransactionController(transactionSvc);