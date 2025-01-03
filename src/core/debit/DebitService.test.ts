import { Port } from ".";
import { DebitService } from "./DebitService";

describe('initiate object', () => {
    test('initiate object expect success', () => {
        const mockPort: jest.Mocked<Port> = {
            createOrUpdate: jest.fn(),
            update: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn(),
        };
        const svc = new DebitService(mockPort);
    })
})
