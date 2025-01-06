import { DepositServiceResult, Service, TransferServiceResult } from "./spec";
import { sub } from "../../common/util/calculator";
import * as Balance from "../balance";
import * as Debit from "../debit";

export class TransactionService implements Service {
    private balanceService: Balance.Service
    private debitService: Debit.Service

    constructor(balanceService: Balance.Service, debitService: Debit.Service) {
        this.balanceService = balanceService;
        this.debitService = debitService;
    }

    public async transfer(senderUsername: string, recipientUsername: string, amount: number): Promise<TransferServiceResult> {
        if (isNaN(amount)) {
            throw new Error("transfer amount is not valid");
        }
        
        if (amount <= 0) {
            throw new Error("amount cannot be less than 0");
        }

        const senderBalance = await this.balanceService.findBy(senderUsername);
        if (senderBalance == null) {
            throw new Error("user balance is not exist");
        }

        const recipientBalance = await this.balanceService.findBy(recipientUsername);
        if (recipientBalance == null) {
            throw new Error("user balance is not exist");
        }

        const lenderDebit =  await this.debitService.findByLenderAndBorrower(senderUsername, recipientUsername);
        if (lenderDebit != null && lenderDebit.amount != 0) {
            return this.handleTransferWhenSenderIsLender(senderBalance, recipientBalance, lenderDebit, amount);
        }

        const borrowerDebit = await this.debitService.findByLenderAndBorrower(recipientUsername, senderUsername);
        if (borrowerDebit != null && borrowerDebit.amount != 0) {
            return this.handleTransferWhenSenderIsBorrower(senderBalance, recipientBalance, borrowerDebit, amount);
        }

        return this.handleTransferWhenDebitNotExist(senderBalance, recipientBalance, amount);
    }

    public async deposit(username: string, amount: number): Promise<DepositServiceResult> {
        if (isNaN(amount)) {
            throw new Error("transfer amount is not valid");
        }

        if (amount <= 0) {
            throw new Error("amount cannot be less than 0");
        }

        const depositor = await this.balanceService.findBy(username);
        if (depositor == null) {
            throw new Error("user balance is not exist");
        }

        const debits = await this.debitService.findByBorrower(username);
        if (debits != null && debits.length > 0) {
            return this.handleDepositIfDebitExist(depositor, amount, debits);
        }

        return this.handleDepositIfDebitNotExist(username, amount);
    }

    private async handleDepositIfDebitNotExist(username: string, amount: number): Promise<DepositServiceResult> {
        try {
            const balance = await this.balanceService.append(username, amount);
            return this.mapToDepositServiceResult(0, "", balance, 0);
        } catch (err) {
            // handle error
            throw new Error("error while deposit")
        }
    }

    private async handleDepositIfDebitExist(depositor: Balance.FindByServiceResult, amount: number, debits: Debit.FindByLenderServiceResult[]): Promise<DepositServiceResult> {
        const firstDebit = debits[0];
        let adtDepositorBalance = 0;
        let adtRecipientBalance = 0;
        let newDepositorDebt = 0;

        const recipientBalance = await this.balanceService.findBy(firstDebit.lender);
        if (recipientBalance == null) {
            throw new Error("user balance is not exist");
        }

        if (firstDebit.amount - amount < 0) {
            adtDepositorBalance = amount - firstDebit.amount;
            adtRecipientBalance = firstDebit.amount;
        } else {
            newDepositorDebt = firstDebit.amount - amount;
            adtRecipientBalance = amount;
        }

        try {
            const newSenderBalance = await this.balanceService.append(depositor.username, adtDepositorBalance);
            await this.balanceService.append(recipientBalance.username, adtRecipientBalance);
            await this.debitService.update(firstDebit.lender, firstDebit.borrower, newDepositorDebt);

            return this.mapToDepositServiceResult(adtRecipientBalance, recipientBalance.username, newSenderBalance, newDepositorDebt);
        } catch (err) {
            await this.balanceService.update(depositor.username, depositor.balance);
            await this.balanceService.update(recipientBalance.username, recipientBalance.balance);
            await this.debitService.update(firstDebit.lender, firstDebit.borrower, firstDebit.amount);

            return null;
        }
    }

    private async handleTransferWhenSenderIsLender(senderBalance: Balance.FindByServiceResult, recipientBalance: Balance.FindByServiceResult, debit: Debit.FindByLenderAndBorrowerServiceResult, amount: number): Promise<TransferServiceResult> {
        let adtSenderBalance = 0;
        let adtRecipientBalance = 0;
        let newRecipientDebt = Number(debit.amount) + Number(amount);
        let newSenderDebt = 0;

        if (senderBalance.balance < amount) {
            adtSenderBalance = senderBalance.balance != 0 && debit.amount - amount < 0 ? senderBalance.balance * -1 : 0;
            adtRecipientBalance = Math.abs(adtSenderBalance);
            newRecipientDebt = debit.amount - amount < 0 ? 0 : debit.amount - amount;
            newSenderDebt = debit.amount - amount < 0 ? Math.abs(debit.amount - amount) - senderBalance.balance : 0;
        } else {
            const [currDebt, remainingDebt] = sub(debit.amount, amount);
            adtSenderBalance = remainingDebt != 0 ? remainingDebt * -1 : 0;
            adtRecipientBalance = remainingDebt;
            newRecipientDebt = remainingDebt != 0 ? 0 : currDebt;
        }

        try {
            const newSenderBalance = await this.balanceService.append(senderBalance.username, adtSenderBalance);
            await this.balanceService.append(recipientBalance.username, adtRecipientBalance);
            const newDebit = await this.debitService.createOrUpdate(senderBalance.username, recipientBalance.username, newRecipientDebt);
            
            if (newSenderDebt > 0) {
                await this.debitService.createOrUpdate(recipientBalance.username, senderBalance.username, newSenderDebt);
            }

            return this.mapToTransferServiceResult(adtRecipientBalance, newSenderBalance, newDebit);
        } catch (err) {
            await this.handleRollback( async () => {            
                await this.balanceService.update(senderBalance.username, senderBalance.balance);
                await this.balanceService.update(recipientBalance.username, recipientBalance.balance);
                await this.debitService.update(debit.lender, debit.borrower, debit.amount);
            })

            return null;
        }
        
    }

    private async handleTransferWhenSenderIsBorrower(senderBalance: Balance.FindByServiceResult, recipientBalance: Balance.FindByServiceResult, debit: Debit.FindByLenderAndBorrowerServiceResult, amount: number): Promise<TransferServiceResult> {
        let adtSenderBalance = 0;
        let adtRecipientBalance = 0;
        let newSenderDebt = 0;

        if (senderBalance.balance < amount) {
            adtSenderBalance = senderBalance.balance != 0 ? senderBalance.balance * -1 : 0;
            adtRecipientBalance = senderBalance.balance;
            newSenderDebt = amount - senderBalance.balance + debit.amount;
        } else {
            adtSenderBalance = amount * -1;
            adtRecipientBalance = amount;
            newSenderDebt = debit.amount - amount;
        }
        
        try {
            const newSenderBalance = await this.balanceService.append(senderBalance.username, adtSenderBalance);
            await this.balanceService.append(recipientBalance.username, adtRecipientBalance);
            const newDebit = await this.debitService.createOrUpdate(recipientBalance.username, senderBalance.username, newSenderDebt);
        
            return this.mapToTransferServiceResult(adtRecipientBalance, newSenderBalance, newDebit);
        } catch (err) {
            await this.handleRollback( async () => {   
                await this.balanceService.update(senderBalance.username, senderBalance.balance);
                await this.balanceService.update(recipientBalance.username, recipientBalance.balance);
                await this.debitService.update(debit.lender, debit.borrower, debit.amount);
            });

            return null;
        }

    }

    private async handleTransferWhenDebitNotExist(senderBalance: Balance.FindByServiceResult, recipientBalance: Balance.FindByServiceResult, amount: number): Promise<TransferServiceResult> {
        let adtSenderBalance = 0;
        let adtRecipientBalance = 0;
        let newSenderDebt = 0;

        if (senderBalance.balance < amount) { 
            const [_, rem] = sub(senderBalance.balance, amount);
            newSenderDebt = rem; 
            adtSenderBalance = senderBalance.balance != 0 ? senderBalance.balance * -1 : 0;
            adtRecipientBalance = Math.abs(adtSenderBalance);
        } else {
            adtSenderBalance = amount * -1;
            adtRecipientBalance = amount;
        }
        
        try {
            const newSenderBalance = await this.balanceService.append(senderBalance.username, adtSenderBalance);
            await this.balanceService.append(recipientBalance.username, adtRecipientBalance);
    
            let newDebit = null;
            if (newSenderDebt != 0) {
                newDebit = await this.debitService.createOrUpdate(recipientBalance.username, senderBalance.username, newSenderDebt);
            }

            return this.mapToTransferServiceResult(adtRecipientBalance, newSenderBalance, newDebit);
        } catch (err) {
            await this.handleRollback( async () => {   
                await this.balanceService.update(senderBalance.username, senderBalance.balance);
                await this.balanceService.update(recipientBalance.username, recipientBalance.balance);
            });
        }

    }

     
    async handleRollback(fn: () => Promise<any>) {
        try {
            await fn()
        } catch (err) {
            // handle rollback error
        }
    }

    mapToTransferServiceResult(transferAmount: number, newSenderBalance: Balance.AppendServiceResult, newDebit: Debit.CreateOrUpdateServiceResult | null): TransferServiceResult {
        const res = new TransferServiceResult();
        res.balance = newSenderBalance.balance;
        res.transferAmount = transferAmount;
        res.owedTo = "";
        res.owedToAmount = 0;
        res.owedFrom = "";
        res.owedFromAmount = 0;

        if (newDebit != null && newDebit.borrower == newSenderBalance.username && newDebit.amount != 0) {
            res.owedTo = newDebit.lender;
            res.owedToAmount = newDebit.amount;
        } else if (newDebit != null && newDebit.lender == newSenderBalance.username && newDebit.amount != 0) {
            res.owedFrom = newDebit.borrower;
            res.owedFromAmount = newDebit.amount;
        }

        return res;
    }

    private mapToDepositServiceResult(transferAmount: number, transferRecipient: string, result: Balance.UpdateServiceResult, owed: number): DepositServiceResult {
        const res = new DepositServiceResult();
        res.username = result.username;
        res.balance = result.balance;
        res.transferAmount = transferAmount;
        res.transferRecipient = transferRecipient;
        res.owed = owed;
        return res;
    }
}