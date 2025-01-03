export interface Port {
    createOrUpdate(lender: string, borrower: string, amount: number): Promise<CreateOrUpdatePortResult>
    update(lender: string, borrower: string, amount: number): Promise<any>;
    findByBorrower(borrower: string): Promise<FindByPortResult[]>
    findByLenderAndBorrower(usernameLender: string, usernameBorrower: string): Promise<FindByPortResult>
    findByLenderOrBorrower(username): Promise<FindByPortResult[]>
}

export interface Service {
    createOrUpdate(lender: string, borrower: string, amount: number): Promise<CreateOrUpdateServiceResult>;
    update(lender: string, borrower: string, amount: number): Promise<any>;
    findByLenderAndBorrower(lender: string, borrower: string): Promise<FindByLenderAndBorrowerServiceResult>;
    findByBorrower(borrower: string): Promise<FindByLenderServiceResult[]>;
    findByLenderOrBorrower(username: string): Promise<FindByServiceResult[]>;
}

export class BaseFindByResult {
    lender: string;
    borrower: string;
    amount: number;
}

export class FindByPortResult extends BaseFindByResult {}

export class FindByServiceResult extends BaseFindByResult {}

export class FindByLenderAndBorrowerServiceResult extends BaseFindByResult {}

export class FindByLenderServiceResult extends BaseFindByResult {}

export class CreateOrUpdateServiceResult extends BaseFindByResult {}

export class CreateOrUpdatePortResult extends BaseFindByResult {}