import { FindByServiceResult, Port } from "./spec";

export class UserService {
    private adapter: Port;

    constructor(adapter: Port) {
        this.adapter = adapter;
    }

    public async findBy(username: string): Promise<FindByServiceResult | null>  {
        const user = await this.adapter.findBy(username);
        if (user == null) {
            return null;
        } 
        const userSvc = new FindByServiceResult();
        userSvc.username = user.username;
        return userSvc;
    }
}

