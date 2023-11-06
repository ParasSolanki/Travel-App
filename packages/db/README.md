# Travel App DB

Travel app uses [SQLite](https://www.sqlite.org/index.html) database and [Prisma](https://www.prisma.io/) as a ORM (Object–relational mapping).

## Installation

Install Dependencies.

```bash
  pnpm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

## Seed Database

Run the below script to seed the database with default roles data.

```bash
npx prisma db seed
```

## Prisma Studio

To see all of your database data locally, you can run the prisma studio command, which will show you all of your data. [For more details.](https://www.prisma.io/studio)

```bash
npx prisma studio
```
