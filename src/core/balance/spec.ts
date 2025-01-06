// interfaces
export interface Port {
    findBy(username: string): Promise<FindByPortResult | null>
    update(username: string, amount: number, version: number): Promise<UpdatePortResult | null>
}

export interface Service {
    findBy(username: string): Promise<FindByServiceResult | null>
    append(username: string, adtAmount: number): Promise<AppendServiceResult | null> // refine later
    update(username: string, newAmount: number): Promise<UpdateServiceResult>
}

// dto
export class FindByPortResult {
    username: string
    balance: number
    version: number

    public map(): FindByServiceResult {
        const res = new FindByServiceResult();
        res.username = this.username;
        res.balance = this.balance;
        res.version = this.version;
        return res;
    }
}

export class FindByServiceResult {
    username: string
    balance: number
    version: number    
}

export class UpdatePortResult {
    username: string
    balance: number
    version: number

    public map(): AppendServiceResult {
        const res = new AppendServiceResult();
        res.balance = this.balance;
        res.username = this.username;
        res.version = this.version;
        return res;
    }
}

export class AppendServiceResult {
    username: string
    balance: number
    version: number
}

export class UpdateServiceResult {
    username: string
    balance: number
    version: number
}