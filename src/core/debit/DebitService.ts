import { Port, FindByLenderAndBorrowerServiceResult, FindByLenderServiceResult, Service, BaseFindByResult, FindByServiceResult } from "./spec";

export class DebitService implements Service {
    private adapter: Port

    constructor(port: Port) {
        this.adapter = port;
    }

    public findByLenderOrBorrower(username: string): Promise<FindByServiceResult[]> {
        return this.adapter.findByLenderOrBorrower(username);
    }

    public createOrUpdate(lender: string, borrower: string, amount: number): Promise<any> {
        if (isNaN(amount)) {
            throw new Error("debit amount is not valid");
        }
        return this.adapter.createOrUpdate(lender, borrower, amount);
    }
    
    public update(lender: string, borrower: string, amount: number): Promise<any> {
        return this.adapter.update(lender, borrower, amount);
    }

    public findByLenderAndBorrower(lender: string, borrower: string): Promise<FindByLenderAndBorrowerServiceResult | null> {
        return this.adapter.findByLenderAndBorrower(lender, borrower);
    }

    public async findByBorrower(lender: string): Promise<FindByLenderServiceResult[]> {
        const res = await this.adapter.findByBorrower(lender);
        const svcRes = [];
        for (const r of res) {
            svcRes.push(this.mapToSvcResult(r));
        }
        return svcRes;
    }

    private mapToSvcResult(portResult: BaseFindByResult): FindByLenderServiceResult {
        const res = new FindByLenderServiceResult();
        res.lender = portResult.lender;
        res.borrower = portResult.borrower;
        res.amount = portResult.amount;
        return res;
    }
}
