import { RxDatabase } from "rxdb";
import { FindByPortResult, Port } from "../../core/user";

export class UserRepository implements Port {
    private db: RxDatabase;

    constructor(db: RxDatabase) {
        this.db = db;
    }

    public async findBy(username: string): Promise<FindByPortResult | null> {
        const user = await this.db.users.findOne({
            selector: {
                username: {
                    $eq: username
                }
            }
        }).exec();

        if (user == null || user._data == null) {
            return null;
        }

        return this.mapToPortResult(user._data);
    }

    private mapToPortResult(data: any): FindByPortResult {
        const portResult = new FindByPortResult();
        portResult.username = data.username;
        return portResult;
    }
}