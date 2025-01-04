import { Port, AppendServiceResult, FindByPortResult, UpdatePortResult, FindByServiceResult } from "./spec";
import { BalanceService } from "./BalanceService";

describe('initiate object', () => {
    test('initiate object expect success', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        const svc = new BalanceService(mockPort);
    })
})

describe('append()', () => {
    test('when balancePort.findBy return empty expect throw error', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        mockPort.findBy.mockResolvedValueOnce(null)
        const svc = new BalanceService(mockPort);
        try {
            const res = await svc.append("parker", 1000);
            expect(0).toBe(1);
        } catch (err) {
            expect(err.message).toEqual("user balance is not exist");
        }
    })

    test('when balancePort.findBy return object but balancePort.update() return null expect throw error', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        const mockBalanceRes = new FindByPortResult()
        mockPort.findBy.mockResolvedValueOnce(mockBalanceRes)
        mockPort.update.mockResolvedValueOnce(null)
        const svc = new BalanceService(mockPort);
        try {
            const res = await svc.append("parker", 10000);
            expect(0).toBe(1);
        } catch (err) {
            expect(err.message).toEqual("error while updating balance");
        }
    })

    test('when balancePort.findBy return object and balancePort.update() expect success', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        const mockFindByRes = new FindByPortResult();
        const mockUpdateRes = new UpdatePortResult();
        mockUpdateRes.username = "parker";
        mockPort.findBy.mockResolvedValueOnce(mockFindByRes);
        mockPort.update.mockResolvedValueOnce(mockUpdateRes);
        
        const svc = new BalanceService(mockPort);
        const res = await svc.append("parker", 10000);
        const expectedRes = new AppendServiceResult();
        expectedRes.username = "parker";

        expect(res).toEqual(expectedRes);
        expect(res instanceof AppendServiceResult).toBeTruthy();
    })

    
    test('when current balance is 1000 and update amount is 2000 expect balancePort.update called with amount 3000', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        const mockFindByRes = new FindByPortResult();
        mockFindByRes.balance = 1000;
        mockFindByRes.version = 1;

        const mockUpdateRes = new UpdatePortResult();
        mockUpdateRes.username = "parker";

        mockPort.findBy.mockResolvedValueOnce(mockFindByRes);
        mockPort.update.mockResolvedValueOnce(mockUpdateRes);
        
        const svc = new BalanceService(mockPort);
        const res = await svc.append("parker", 2000);

        expect(mockPort.update).toHaveBeenCalledWith("parker", 3000, 1)
        expect(res instanceof AppendServiceResult).toBeTruthy();
    })

    test('when current balance is 3000 and update amount is -2000 expect balancePort.update called with amount 1000', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        const mockFindByRes = new FindByPortResult();
        mockFindByRes.balance = 3000;
        mockFindByRes.version = 1;

        const mockUpdateRes = new UpdatePortResult();
        mockUpdateRes.username = "parker";

        mockPort.findBy.mockResolvedValueOnce(mockFindByRes);
        mockPort.update.mockResolvedValueOnce(mockUpdateRes);
        
        const svc = new BalanceService(mockPort);
        const res = await svc.append("parker", -2000);

        expect(mockPort.update).toHaveBeenCalledWith("parker", 1000, 1)
        expect(res instanceof AppendServiceResult).toBeTruthy();
    })

    test('when current balance is 3000 and update amount is -4000 expect throw error insufficient', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        const mockFindByRes = new FindByPortResult();
        mockFindByRes.balance = 3000;
        mockFindByRes.version = 1;

        const mockUpdateRes = new UpdatePortResult();
        mockUpdateRes.username = "parker";

        mockPort.findBy.mockResolvedValueOnce(mockFindByRes);
        mockPort.update.mockResolvedValueOnce(mockUpdateRes);
        
        try {
            const svc = new BalanceService(mockPort);
            const res = await svc.append("parker", -4000);
            expect(1).toBe(0);
        } catch (err) {
            expect(err.message).toBe("insufficient balance");
        }
    })
})

describe('findBy()', () => {
    test('when balancePort.findBy return empty expect throw error', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        mockPort.findBy.mockResolvedValueOnce(null)
        const svc = new BalanceService(mockPort);
        try {
            const res = await svc.findBy("parker");
            expect(0).toBe(1);
        } catch (err) {
            expect(err.message).toEqual("user balance is not exist");
        }
    })

    test('when balancePort.findBy return object expect success', async () => {
        const mockPort: jest.Mocked<Port> = {
            findBy: jest.fn(),
            update: jest.fn()
        };
        const mockFindByRes = new FindByPortResult();
        mockFindByRes.username = "parker";
        mockPort.findBy.mockResolvedValueOnce(mockFindByRes)
        
        const svc = new BalanceService(mockPort);
        const res = await svc.findBy("parker");
        const expectedRes = new FindByServiceResult();
        expectedRes.username = "parker";

        expect(res).toEqual(expectedRes);
        expect(res instanceof FindByServiceResult).toBeTruthy();
    })
})