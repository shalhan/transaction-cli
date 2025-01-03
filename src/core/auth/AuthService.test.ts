import {describe, expect, test} from '@jest/globals';
import {AuthService} from './AuthService';
import { LoginServiceResult } from './index'; 

import * as User from "../user";
import * as Balance from "../balance";
import * as Debit from "../debit";

describe('initiate object', () => {
    test('initiate object expect success', async () => {
        const mockUserSvc: jest.Mocked<User.Service> = {
            findBy: jest.fn()
        };
        const mockBalanceSvc: jest.Mocked<Balance.Service> = {
            findBy: jest.fn(),
            append: jest.fn(),
            update: jest.fn(),
        };
        const mockDebitSvc: jest.Mocked<Debit.Service> = {
            createOrUpdate: jest.fn(),
            update: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const svc = new AuthService(mockUserSvc, mockBalanceSvc, mockDebitSvc);
    })
})

describe('login()', () => {
    test('when username is empty string expect throw error', async () => {
        const username = ""
        const mockUserSvc: jest.Mocked<User.Service> = {
            findBy: jest.fn()
        };
        const mockBalanceSvc: jest.Mocked<Balance.Service> = {
            findBy: jest.fn(),
            append: jest.fn(),
            update: jest.fn(),
        };
        const mockDebitSvc: jest.Mocked<Debit.Service> = {
            createOrUpdate: jest.fn(),
            update: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const svc = new AuthService(mockUserSvc, mockBalanceSvc, mockDebitSvc);
        try {
            const res = await svc.login(username);
            expect(1).toEqual(0);
        } catch(err) {
            expect(err.message).toEqual("username cannot be empty");
        }
    })

    test('when userPort.findBy() return empty object expect throw error', async () => {
        const username = "parker"
        const mockUserSvc: jest.Mocked<User.Service> = {
            findBy: jest.fn()
        };
        const mockBalanceSvc: jest.Mocked<Balance.Service> = {
            findBy: jest.fn(),
            append: jest.fn(),
            update: jest.fn(),
        };
        const mockDebitSvc: jest.Mocked<Debit.Service> = {
            createOrUpdate: jest.fn(),
            update: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const svc = new AuthService(mockUserSvc, mockBalanceSvc, mockDebitSvc);
        try {
            const res = await svc.login(username);
            expect(1).toEqual(0);
        } catch(err) {
            expect(err.message).toEqual("username is not exist");
        }
    })

    test('when userPort.findBy() return user object expect success', async () => {
        const username = "parker";
        const mockUserSvc: jest.Mocked<User.Service> = {
            findBy: jest.fn()
        };
        const mockBalanceSvc: jest.Mocked<Balance.Service> = {
            findBy: jest.fn(),
            append: jest.fn(),
            update: jest.fn(),
        };
        const mockDebitSvc: jest.Mocked<Debit.Service> = {
            createOrUpdate: jest.fn(),
            update: jest.fn(),
            findByLenderAndBorrower: jest.fn(),
            findByBorrower: jest.fn(),
            findByLenderOrBorrower: jest.fn()
        };
        const mockUser = new User.FindByServiceResult();
        mockUser.username = "parker";
        mockUserSvc.findBy.mockResolvedValueOnce(mockUser);

        const mockBalance = new Balance.FindByServiceResult();
        mockBalance.username = "parker";
        mockBalanceSvc.findBy.mockResolvedValueOnce(mockBalance);

        const expectedRes = {
            balance: undefined,
            owedFrom: "",
            owedFromAmount: 0,
            owedTo: "",
            owedToAmount: 0,
            username: "parker",
        }
        const svc = new AuthService(mockUserSvc, mockBalanceSvc, mockDebitSvc);
        const res = await svc.login(username);

        expect(res).toEqual(expectedRes);
        expect(res instanceof LoginServiceResult).toBeTruthy();
    })
})