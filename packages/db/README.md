# Travel App DB

Travel app uses [SQLite](https://www.sqlite.org/index.html) database and [Prisma](https://www.prisma.io/) as a ORM (Object–relational mapping).

## Installation

Install Dependencies.

```bash
  pnpm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Name         | Description       |
| ------------ | ----------------- |
| DATABASE_URL | The database URL. |

## Setup and Seed Database

To Setup the database first you have to push the schema in database for that run below command.

```bash
  npx prisma db push
```

Run the below script to seed the database with default roles and users data.

```bash
  npx prisma db seed
```

To generate prisma client you can run below command.

```bash
  npx prisma generate
```

## Prisma Studio

To see all of your database data locally, you can run the prisma studio command, which will show you all of your data. [For more details.](https://www.prisma.io/studio)

```bash
npx prisma studio
```
