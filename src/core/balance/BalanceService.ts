import { Port, FindByServiceResult, AppendServiceResult, Service, UpdateServiceResult, FindByPortResult, UpdatePortResult } from "./spec"

export class BalanceService implements Service {
    private balanceAdapter: Port

    constructor(port: Port) {
        this.balanceAdapter = port
    }

    public async findBy(username: string): Promise<FindByServiceResult | null> {
        const balance = await this.balanceAdapter.findBy(username)
        if (balance == null) {
            throw new Error("user balance is not exist");
        }

        return this.mapToFindByServiceResult(balance);
    }

    public async append(username: string, amount: number): Promise<AppendServiceResult | null> {
        const balance = await this.balanceAdapter.findBy(username)
        if (balance == null) {
            throw new Error("user balance is not exist");
        }

        const newAmount = Number(balance.balance) + Number(amount);
        if (newAmount < 0) {
            throw new Error("insufficient balance");
        }

        const newBalance = await this.balanceAdapter.update(username, newAmount, balance.version);
        if (newBalance == null) {
            throw new Error("error while updating balance");
        }

        return this.mapToAppendServiceResult(newBalance);
    }

    public update(username: string, newAmount: number): Promise<UpdateServiceResult> {
        throw new Error("");
    }

    private mapToFindByServiceResult(portResult: FindByPortResult): FindByServiceResult {
        const svcResult = new FindByServiceResult();
        svcResult.username = portResult.username;
        svcResult.balance = portResult.balance;
        svcResult.version = portResult.version;
        return svcResult;
    }

    private mapToAppendServiceResult(portResult: UpdatePortResult): AppendServiceResult {
        const svcResult = new AppendServiceResult();
        svcResult.username = portResult.username;
        svcResult.balance = portResult.balance;
        svcResult.version = portResult.version;
        return svcResult;
    }
}