import { RxDatabase } from "rxdb";
import { FindByPortResult, Port } from "../../core/debit";

export class DebitRepository implements Port {
    private db: RxDatabase;

    constructor(db: RxDatabase) {
        this.db = db;
    }
    async createOrUpdate(lender: string, borrower: string, amount: number): Promise<any> {
        const debit = await this.db.debits.upsert({
            lender: lender,
            borrower: borrower,
            amount: amount
        });

        return this.mapToPortResult(debit);
    }

    async update(usernameLender: string, usernameBorrwer: string, amount: number): Promise<any> {
        const query = this.db.debits.findOne({
            selector: {
                lender: {
                    $eq: usernameLender,
                },
                borrower: {
                    $eq: usernameBorrwer
                },
            }
        })
        await query.update({
            $set: {
                amount: amount 
            }
        })
    }

    async findByBorrower(username: string): Promise<FindByPortResult[]> {
        const debits = await this.db.debits.find({
            selector: {
                borrower: {
                    $eq: username
                },
                amount: {
                    $gt: 0
                }
            }
        }).exec();

        if (debits == null || debits.length == 0) {
            return []
        }

        const portRes = []
        for (const debit of debits) {
            portRes.push(this.mapToPortResult(debit._data));
        }

        return portRes;
    }

    async findByLenderAndBorrower(usernameLender: string, usernameBorrwer: string): Promise<FindByPortResult> {
        const debit = await this.db.debits.findOne({
            selector: {
                lender: {
                    $eq: usernameLender,
                },
                borrower: {
                    $eq: usernameBorrwer
                }
            }
        }).exec();

        if (debit == null || debit._data == null) {
            return null
        }

        return this.mapToPortResult(debit._data);
    }

    async findByLenderOrBorrower(username: string): Promise<FindByPortResult[]> {
        const debits = await this.db.debits.find({
            selector: {
                $or: [
                    { lender: { $eq: username } },
                    { borrower: { $eq: username } }
                ]
            }
        }).exec();

        if (debits == null || debits.length == 0) {
            return [];
        }

        const portRes = []
        for (const debit of debits) {
            portRes.push(this.mapToPortResult(debit._data));
        }

        return portRes;
    }

    private mapToPortResult(data: any): FindByPortResult {
        const portResult = new FindByPortResult();
        portResult.lender = data.lender;
        portResult.borrower = data.borrower;
        portResult.amount = data.amount;
        return portResult;
    }
}