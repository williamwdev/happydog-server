# HappyDog Server

## Setting Up

- Install dependencies: `npm install`
- Create development and test databases: `createdb happydog`, `createdb happydog-test`
- Create database user: `createuser happydog`
- Grant privileges to new user in `psql`:
  - `GRANT ALL PRIVILEGES ON DATABASE happydog TO happydog`
  - `GRANT ALL PRIVILEGES ON DATABASE happydog-test TO happydog`
- Prepare environment file: `cp example.env .env`
  - Replace values in `.env` with your custom values if necessary.
- Bootstrap development database: `MIGRATION_DB_NAME=happydog npm run migrate`
- Bootstrap test database: `MIGRATION_DB_NAME=thingful-test npm run migrate`

## Sample Data

- To seed the database for development: `psql -U happydog -d happydog -a -f seeds/seed.happydog_tables.sql`
- To clear seed data: `psql -U happydog -d happydog -a -f seeds/trunc.happydog_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Run tests: `npm test`

## Login instructions

- Demo login: user: demo / pw: Demo1234!
