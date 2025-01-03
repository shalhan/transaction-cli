import { RxDatabase } from "rxdb";
import { FindByPortResult, Port, UpdatePortResult } from "../../core/balance";

export class BalanceRepository implements Port {
    private db: RxDatabase;

    constructor(db: RxDatabase) {
        this.db = db;
    }

    async findBy(username: string): Promise<FindByPortResult | null> {
        const balance = await this.db.balances.findOne({
            selector: {
                username: {
                    $eq: username
                }
            }
        }).exec();

        if (balance == null || balance._data == null) {
            return null;
        }

        return this.mapToFindByPortResult(balance._data)
    }

    async update(username: string, amount: number, version: number): Promise<UpdatePortResult | null> {
        const balanceDoc = await this.db.balances.findOne({
            selector: {
                username: {
                    $eq: username
                }
            }
        });
        const newBalance = await balanceDoc.update({
            $set: {
                balance: amount
            }
        });

        return this.mapToUpdatePortResult(newBalance._data)
    }

    private mapToFindByPortResult(balance: any): FindByPortResult {
        const portResult = new FindByPortResult();
        portResult.username = balance.username;
        portResult.balance = balance.balance;
        portResult.version = balance.version;
        return portResult;
    }

    private mapToUpdatePortResult(balance: any): UpdatePortResult {
        const portResult = new UpdatePortResult();
        portResult.username = balance.username;
        portResult.balance = balance.balance;
        portResult.version = balance.version;
        return portResult;
    }
}