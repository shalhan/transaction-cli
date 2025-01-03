export interface Service {
    login(username: string): Promise<LoginServiceResult | null>
    logout(username: string): Promise<void>
}

export class LoginServiceResult {
    username: string;
    balance: number;
    owedTo: string;
    owedToAmount: number;
    owedFrom: string;
    owedFromAmount: number;
}