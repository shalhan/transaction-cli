export interface Service {
    transfer(from: string, to: string, amount: number): Promise<TransferServiceResult>;
    deposit(username: string, amount: number): Promise<DepositServiceResult>;
}

export class TransferServiceResult {
    username: string;
    balance: number;
    transferAmount: number;
    owedToAmount: number;
    owedTo: string;
    owedFromAmount: number;
    owedFrom: string;
}

export class DepositServiceResult {
    username: string;
    balance: number;
    transferAmount: number;
    transferRecipient: string;
    owed: number;
}
