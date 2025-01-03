import { AppendServiceResult, FindByServiceResult, Service } from "../balance";
import { TransactionService } from "./TransactionService";
import * as DebitService from "../debit";
import { FindByLenderAndBorrowerServiceResult } from "../debit";

describe('initiate object', () => {
    test('initiate object expect success', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            findBy: jest.fn(),
            append: jest.fn(),
            update: jest.fn(),
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            update: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const svc = new TransactionService(mockBalanceService, mockDebitService);
    })
})

describe('transfer()', () => {
    test('when amount equal zero expect return error', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        mockBalanceService.findBy.mockResolvedValueOnce(null)
        const svc = new TransactionService(mockBalanceService, mockDebitService);
        try {
            const res = await svc.transfer("parker", "cindy", 0);
            expect(0).toBe(1);
        } catch (err) {
            console.log("\nslkdjfklsdjfk=>", err.message, "dfddd\n")
            expect(err.message).toEqual("invalid amount");
        }
    })

    test('when amount lower then zero expect return error', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            update: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        mockBalanceService.findBy.mockResolvedValueOnce(null)
        const svc = new TransactionService(mockBalanceService, mockDebitService);
        try {
            const res = await svc.transfer("parker", "cindy", -1000);
            expect(0).toBe(1);
        } catch (err) {
            expect(err.message).toEqual("invalid amount");
        }
    })

    test('when the first balanceService.finBy() return null expect throw error', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            findBy: jest.fn(),
            append: jest.fn(),
            update: jest.fn(),
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        mockBalanceService.findBy.mockResolvedValueOnce(null)
        const svc = new TransactionService(mockBalanceService, mockDebitService);
        try {
            const res = await svc.transfer("parker", "cindy", 1000);
            expect(0).toBe(1);
        } catch (err) {
            expect(err.message).toEqual("user balance is not exist");
        }
    })

    test('when the second balanceService.finBy() return null expect throw error', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            findBy: jest.fn(),
            append: jest.fn(),
            update: jest.fn(),
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.balance = 2000
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
        mockBalanceService.findBy.mockResolvedValueOnce(null)

        const svc = new TransactionService(mockBalanceService, mockDebitService);
        try {
            const res = await svc.transfer("parker", "cindy", 1000);
            expect(0).toBe(1);
        } catch (err) {
            expect(err.message).toEqual("user balance is not exist");
        }
    })

    test('when the sender is lender, send 1000, debit amount 5000 expect debit amount 4000', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.username = "a";
        mockFindByRes1.balance = 2000;

        const mockFindByRes2 = new FindByServiceResult();
        mockFindByRes2.username = "b";
        mockFindByRes2.balance = 2000;
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2)

        const mockFindByLenderAndBorrower = new FindByLenderAndBorrowerServiceResult();
        mockFindByLenderAndBorrower.lender = "a";
        mockFindByLenderAndBorrower.borrower = "b";
        mockFindByLenderAndBorrower.amount = 5000;

        mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(mockFindByLenderAndBorrower);


        const svc = new TransactionService(mockBalanceService, mockDebitService);
        const res = await svc.transfer("a", "b", 1000);

        expect(mockBalanceService.append).toHaveBeenCalledWith("a", 0);
        expect(mockBalanceService.append).toHaveBeenCalledWith("b", 0);
        expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("a", "b", 4000);
    })

    test('when the sender is lender, send 100, debit amount 300 expect debit amount 200', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.username = "a";
        mockFindByRes1.balance = 100;

        const mockFindByRes2 = new FindByServiceResult();
        mockFindByRes2.username = "b";
        mockFindByRes2.balance = 200;
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2)

        const mockFindByLenderAndBorrower = new FindByLenderAndBorrowerServiceResult();
        mockFindByLenderAndBorrower.lender = "a";
        mockFindByLenderAndBorrower.borrower = "b";
        mockFindByLenderAndBorrower.amount = 300;

        mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(mockFindByLenderAndBorrower);


        const svc = new TransactionService(mockBalanceService, mockDebitService);
        const res = await svc.transfer("a", "b", 100);

        expect(mockBalanceService.append).toHaveBeenCalledWith("a", 0);
        expect(mockBalanceService.append).toHaveBeenCalledWith("b", 0);
        expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("a", "b", 200);
    })

    test('when the sender is lender, send 1000, debit amount 800 expect debit amount 0, recipient amount +200', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.username = "a";
        mockFindByRes1.balance = 2000;

        const mockFindByRes2 = new FindByServiceResult();
        mockFindByRes2.username = "b";
        mockFindByRes2.balance = 2000;
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2)
        
        const mockFindByLenderAndBorrower = new FindByLenderAndBorrowerServiceResult();
        mockFindByLenderAndBorrower.lender = "a";
        mockFindByLenderAndBorrower.borrower = "b";
        mockFindByLenderAndBorrower.amount = 800;

        mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(mockFindByLenderAndBorrower);


        const svc = new TransactionService(mockBalanceService, mockDebitService);
        const res = await svc.transfer("a", "b", 1000);

        expect(mockBalanceService.append).toHaveBeenCalledWith("a", -200);
        expect(mockBalanceService.append).toHaveBeenCalledWith("b", 200);
        expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("a", "b", 0);
    })

    test('when the sender is lender, send 1000 while balance is 100, debit amount 800 expect debit amount 0, recipient amount +200, sender own 500 to recipient', async () => {
            const mockBalanceService: jest.Mocked<Service> = {
                findBy: jest.fn(),
                append: jest.fn(),
                update: jest.fn(),
            };
            const mockDebitService: jest.Mocked<DebitService.Service> = {
                update: jest.fn(),
                createOrUpdate: jest.fn(),
                findByLenderAndBorrower: jest.fn(),
                findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
            };

            const mockFindByRes1 = new FindByServiceResult();
            mockFindByRes1.username = "a";
            mockFindByRes1.balance = 100;
    
            const mockFindByRes2 = new FindByServiceResult();
            mockFindByRes2.username = "b";
            mockFindByRes2.balance = 200;
            mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
            mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2)
            
            const mockFindByLenderAndBorrower = new FindByLenderAndBorrowerServiceResult();
            mockFindByLenderAndBorrower.lender = "a";
            mockFindByLenderAndBorrower.borrower = "b";
            mockFindByLenderAndBorrower.amount = 800;
    
            mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(mockFindByLenderAndBorrower);
    
    
            const svc = new TransactionService(mockBalanceService, mockDebitService);
            const res = await svc.transfer("a", "b", 1000);
    
            expect(mockBalanceService.append).toHaveBeenCalledWith("a", -100);
            expect(mockBalanceService.append).toHaveBeenCalledWith("b", 100);
            expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("a", "b", 0);
            expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("b", "a", 100);
    })

    test('when the sender is lender, send 40 while balance is 25, debit amount 50 expect debit amount 0, recipient amount 0, sender own 10 to recipient', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.username = "a";
        mockFindByRes1.balance = 25;

        const mockFindByRes2 = new FindByServiceResult();
        mockFindByRes2.username = "b";
        mockFindByRes2.balance = 200;
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2)
        
        const mockFindByLenderAndBorrower = new FindByLenderAndBorrowerServiceResult();
        mockFindByLenderAndBorrower.lender = "a";
        mockFindByLenderAndBorrower.borrower = "b";
        mockFindByLenderAndBorrower.amount = 50;

        mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(mockFindByLenderAndBorrower);


        const svc = new TransactionService(mockBalanceService, mockDebitService);
        const res = await svc.transfer("a", "b", 40);

        expect(mockBalanceService.append).toHaveBeenCalledWith("a", 0);
        expect(mockBalanceService.append).toHaveBeenCalledWith("b", 0);
        expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("a", "b", 10);
    })


    test('when the sender is borrower, current balance 0, send 1000, current debt is 500, expect current debt added 1000', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };

        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.username = "a";
        mockFindByRes1.balance = 0;

        const mockFindByRes2 = new FindByServiceResult();
        mockFindByRes2.username = "b";
        mockFindByRes2.balance = 2000;
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2)
        
        const mockFindByLenderAndBorrower = new FindByLenderAndBorrowerServiceResult();
        mockFindByLenderAndBorrower.lender = "b";
        mockFindByLenderAndBorrower.borrower = "a";
        mockFindByLenderAndBorrower.amount = 500;

        mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(null);
        mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(mockFindByLenderAndBorrower);


        const svc = new TransactionService(mockBalanceService, mockDebitService);
        const res = await svc.transfer("a", "b", 1000);

        expect(mockBalanceService.append).toHaveBeenCalledWith("a", 0);
        expect(mockBalanceService.append).toHaveBeenCalledWith("b", 0);
        expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("b", "a", 1500);
    })

    test('when the sender is borrower, current balance 500, send 1000, current debt is 500 expect current debt is 500, current sender balance 0', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.username = "a";
        mockFindByRes1.balance = 500;

        const mockFindByRes2 = new FindByServiceResult();
        mockFindByRes2.username = "b";
        mockFindByRes2.balance = 2000;
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2)
        
        const mockFindByLenderAndBorrower = new FindByLenderAndBorrowerServiceResult();
        mockFindByLenderAndBorrower.lender = "b";
        mockFindByLenderAndBorrower.borrower = "a";
        mockFindByLenderAndBorrower.amount = 500;

        mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(null);
        mockDebitService.findByLenderAndBorrower.mockResolvedValueOnce(mockFindByLenderAndBorrower);


        const svc = new TransactionService(mockBalanceService, mockDebitService);
        const res = await svc.transfer("a", "b", 1000);

        expect(mockBalanceService.append).toHaveBeenCalledWith("a", -500);
        expect(mockBalanceService.append).toHaveBeenCalledWith("b", 500);
        expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("b", "a", 1000);
    })
})

describe('deposit()', () => {
    test("when the amount is lower than zero expect throw error", async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const svc = new TransactionService(mockBalanceService, mockDebitService);
        try {
            const res = await svc.deposit("parker", -5000);
            expect(0).toBe(1);
        } catch (err) {
            expect(err.message).toEqual("invalid amount");
        }
    }) 

    test("when the username is not valid expect throw error", async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        mockBalanceService.findBy.mockResolvedValueOnce(null)
        const svc = new TransactionService(mockBalanceService, mockDebitService);
        try {
            const res = await svc.deposit("parker", 5000);
            expect(0).toBe(1);
        } catch (err) {
            expect(err.message).toEqual("user balance is not exist");
        }
    }) 

    test("when depositor doesnt has debit expect add depositor balance", async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockFindByRes = new FindByServiceResult();
        mockFindByRes.username = "a";
        mockFindByRes.balance = 2000;
        const mockAppendRes = new AppendServiceResult();
        mockAppendRes.username = "a";
        mockAppendRes.balance = 7000;

        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes);
        mockDebitService.findByBorrower.mockResolvedValueOnce([]);
        mockBalanceService.append.mockResolvedValueOnce(mockAppendRes);
        const svc = new TransactionService(mockBalanceService, mockDebitService);
        const res = await svc.deposit("parker", 5000);

        expect(mockBalanceService.append).toHaveBeenCalledWith("parker", 5000)
    }) 

    test("when depositor has debit with amount 20 and deposit 50 expect send 20", async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            update: jest.fn(),
            findBy: jest.fn(),
            append: jest.fn()
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            update: jest.fn(),
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.username = "alice";
        mockFindByRes1.balance = 100;

        const mockFindByRes2 = new FindByServiceResult();
        mockFindByRes2.username = "parker";
        mockFindByRes2.balance = 200;

        const mockDebit = new DebitService.FindByLenderServiceResult();
        mockDebit.lender = "parker";
        mockDebit.borrower = "alice";
        mockDebit.amount = 20;

        const mockDebits = [mockDebit];

        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1);
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2);
        mockDebitService.findByBorrower.mockResolvedValueOnce(mockDebits);
        const svc = new TransactionService(mockBalanceService, mockDebitService);
        const res = await svc.deposit("parker", 50);

        expect(mockBalanceService.append).toHaveBeenCalledWith("alice", 30)
        expect(mockBalanceService.append).toHaveBeenCalledWith("parker", 20)
        expect(mockDebitService.update).toHaveBeenCalledWith("parker", "alice", 0)
    }) 
});

describe('test case', () => {
    test('case 1', async () => {
        const mockBalanceService: jest.Mocked<Service> = {
            findBy: jest.fn(),
            append: jest.fn(),
            update: jest.fn(),
        };
        const mockDebitService: jest.Mocked<DebitService.Service> = {
            createOrUpdate: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            update: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };

        const mockFindByRes1 = new FindByServiceResult();
        mockFindByRes1.username = "bob";
        mockFindByRes1.balance = 80;

        const mockFindByRes2 = new FindByServiceResult();
        mockFindByRes2.username = "alice";
        mockFindByRes2.balance = 100;
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes1)
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes2)

        const mockFindByRes3 = new FindByServiceResult();
        mockFindByRes3.username = "bob";
        mockFindByRes3.balance = 30;
        
        const mockFindByRes4 = new FindByServiceResult();
        mockFindByRes4.username = "alice";
        mockFindByRes4.balance = 150;
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes3)
        mockBalanceService.findBy.mockResolvedValueOnce(mockFindByRes4)

        const svc = new TransactionService(mockBalanceService, mockDebitService);
        await svc.transfer("bob", "alice", 50);
        await svc.transfer("bob", "alice", 100);

        expect(mockBalanceService.append).toHaveBeenCalledWith("bob", -50);
        expect(mockBalanceService.append).toHaveBeenCalledWith("alice", 50);
        expect(mockBalanceService.append).toHaveBeenCalledWith("bob", -30);
        expect(mockBalanceService.append).toHaveBeenCalledWith("alice", 30);
        expect(mockDebitService.createOrUpdate).toHaveBeenCalledWith("alice", "bob", 70);
    })
})