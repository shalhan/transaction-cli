import { LoginServiceResult, Service } from ".";
import * as User from "../user";
import * as Balance from "../balance";
import * as Debit from "../debit";

export class AuthService implements Service {
    private userService: User.Service;
    private balanceService: Balance.Service;
    private debitService: Debit.Service;

    constructor(userService: User.Service, balanceService: Balance.Service, debitService: Debit.Service) {
        this.userService = userService;
        this.balanceService = balanceService;
        this.debitService = debitService;
    }

    public async login(username: string): Promise<LoginServiceResult | null> {
        if (username == "") {
            throw new Error("username cannot be empty");
        }

        const user = await this.userService.findBy(username);
        if (user == null) {
            throw new Error("username is not exist");
        }

        const balance = await this.balanceService.findBy(username);
        if (balance == null) {
            throw new Error("balance is not exist");
        }

        const debits = await this.debitService.findByLenderOrBorrower(username);


        return this.map(user, balance, debits);
    }

    public logout(): Promise<void> {
        return;
    }

    private map(user: User.FindByServiceResult, balance: Balance.FindByServiceResult, debits: Debit.FindByServiceResult[]): LoginServiceResult {
        const res = new LoginServiceResult();
        res.username = user.username;
        res.balance = balance.balance;
        res.owedFrom = "";
        res.owedFromAmount = 0;
        res.owedTo = "";
        res.owedToAmount = 0;

        if (debits != null && debits.length > 0) {
            let owedTo = "", owedFrom = "", owedToAmount = 0, owedFromAmount = 0;
            for (const idx in debits) {
                if (debits[idx].borrower == user.username && owedTo == "" && owedToAmount == 0) {
                    res.owedTo = debits[idx].lender;
                    res.owedToAmount = debits[idx].amount;
                } else if (debits[idx].lender == user.username && owedFrom == "" && owedFromAmount == 0) {
                    res.owedFrom = debits[idx].borrower;
                    res.owedFromAmount = debits[idx].amount;
                }
            }
        }

        return res;
    }
}