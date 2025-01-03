import * as Transaction from '../../core/transaction'


export class TransactionController {
    private transactionService: Transaction.Service;
    
    constructor(transactionService: Transaction.Service) {
        this.transactionService = transactionService;
    }
    
    public async transfer(from: string, to: string, amount: number) {
        try {
            const res = await this.transactionService.transfer(from, to, amount);
            if (res.transferAmount != 0) {
                console.log(`Transferred $${res.transferAmount} to ${to}`);
            }
            console.log(`Your balance is $${res.balance}`);
            if (res.owedTo != "" && res.owedToAmount != 0) {
                console.log(`Owed $${res.owedToAmount} to ${res.owedTo}`);
            }
            if (res.owedFrom != "" && res.owedFromAmount != 0) {
                console.log(`Owed $${res.owedFromAmount} from ${res.owedFrom}`);
            }
        } catch (err) {
            console.error('error during transfer', err.message);
        }
    }

    public async deposit(username: string, amount: number) {
        try {
            const res = await this.transactionService.deposit(username, amount);

            if (res.transferAmount != 0) {
                console.log(`Transferred $${res.transferAmount} to ${res.transferRecipient}`);
            }
            console.log(`Your balance is $${res.balance}`);
            if (res.owed != 0) {
                console.log(`Owed $${res.owed} to ${res.transferRecipient}`)
            }
        } catch (err) {
            console.error('error during deposit', err.message);
        }
    }
}