export interface Port {
    findBy(username: string): Promise<FindByPortResult | null>;
}

export interface Service {
    findBy(username: string): Promise<FindByServiceResult | null>;
}

export class FindByServiceResult {
    username: string;
}

export class FindByPortResult {
    username: string;
}