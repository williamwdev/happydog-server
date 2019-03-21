# HappyDog Server

## Setting Up

- Install dependencies: `npm install`
- Create development and test databases: `createdb happydog`
- Create database user: `createuser happydog`
- Grant privileges to new user in `psql`:
  - `GRANT ALL PRIVILEGES ON DATABASE happydog TO happydog`
- Prepare environment file: `cp example.env .env`
  - Replace values in `.env` with your custom values if necessary.
- Bootstrap development database: `MIGRATION_DB_NAME=happydog npm run migrate`

## Sample Data

- To seed the database for development: `psql -U happydog -d happydog -a -f seeds/seed.happydog_tables.sql`
- To clear seed data: `psql -U happydog -d happydog -a -f seeds/trunc.happydog_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Run tests: `npm test`



sendgrid notes:
API KEY: 6779f31a-4c16-11e9-8646-d663bd873d93
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
