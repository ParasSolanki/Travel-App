# Travel App Api

Travel App Api uses [ExpressJS](https://expressjs.com/) with [Zodios](https://www.zodios.org/) to get fully type-safe api client. For authentication, it uses [Lucia](https://lucia-auth.com/), and to validate data uses [Zod](https://github.com/colinhacks/zod).

## Run Locally

Start the dev server

```bash
  pnpm dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Name                 | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| PORT                 | The port that your application will run on.                         |
| WEB_URL              | The URL of your application.                                        |
| AUTH_SECRET          | A secret key that is used to sign and verify authentication tokens. |
| GOOGLE_CLIENT_ID     | The client ID of your Google application.                           |
| GOOGLE_CLIENT_SECRET | The client secret of your Google application.                       |
