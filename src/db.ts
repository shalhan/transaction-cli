import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { addRxPlugin, createRxDatabase } from 'rxdb';
import {
    getRxStorageMongoDB
} from 'rxdb/plugins/storage-mongodb';
import dotenv from 'dotenv'; 

addRxPlugin(RxDBUpdatePlugin)
dotenv.config(); 

export const db = await createRxDatabase({
    name: 'mydatabase',
    storage: getRxStorageMongoDB({
        connection: process.env.DB_URL,
    }),
    ignoreDuplicate: true,
  });
  
const userSchema = {
    "title": "user schema",
    "version": 0,
    "description": "create users collection",
    "primaryKey": "username",
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "maxLength": 100
        }
    },
    "required": [
        "username"
    ]
}

const balanceSchema = {
    "title": "balance schema",
    "version": 0,
    "description": "create users balance collection",
    "primaryKey": "username",
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "maxLength": 100
        },
        "balance": {
            "type": "integer",
        }
    },
    "required": [
        "username", "balance"
    ]
}

const debitSchema = {
    "title": "debit schema",
    "version": 0,
    "description": "create users debit collection",
    "primaryKey": "lender",
    "type": "object",
    "properties": {
        "lender": {
            "type": "integer",
        },
        "borrower": {
            "type": "integer",
        },
        "amount": {
            "type": "integer",
        }
    },
    "required": [
        "lender", "borrower", "amount"
    ]
}

await db.addCollections({
    users: {
        schema: userSchema
    },
    balances: {
        schema: balanceSchema,
    },
    debits: {
        schema: debitSchema,
    }
})