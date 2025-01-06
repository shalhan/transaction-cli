## Prerequisite

1. NodeJs v20.9.0
2. Npm v10.1.0
3. MongoDB

## Getting Started

1. Clone project to your local machine
2. Copy `.env.example` to root folder and rename it to `.env`
3. Fill the `DB_URL` in `.env` with your MongoDB URL
4. Run below command to install all the dependencies
```
npm install
```
5. Run below command to start the app
```
./start.sh
```
6. App is running, hope you enjoy! 😀

## Commands

1. login [username]
2. logout
3. deposit [amount]
4. transfer [usernameReceipient] [amount]