import 'dotenv/config';
import { zodiosApp } from '@zodios/express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { serve, setup } from 'swagger-ui-express';
import { openApiBuilder, bearerAuthScheme } from '@zodios/openapi';
import pino from 'pino-http';
import pretty from 'pino-pretty';
import { protectedRouter } from './protected-app.js';
import { authRouter } from './routes/index.js';
import { oAuthRouter } from './routes/oauth.js';
import { authApi } from './common/api-defs/auth.api.js';
import { env } from './env.js';

const PORT = env.PORT || 3001;

const app = zodiosApp();

// @ts-ignore
const stream = pretty({
  colorize: true,
});

// @ts-ignore
app.use(pino(stream));

const document = openApiBuilder({
  title: 'Travel API',
  version: '1.0.0',
  description: 'Api for travel app',
})
  .addServer({ url: '/api' })
  .addSecurityScheme('session', bearerAuthScheme())
  .addPublicApi(authApi)
  .build();

app.use('/docs/swagger.json', (_, res) => res.json(document));
app.use('/docs', serve);
app.use('/docs', setup(undefined, { swaggerUrl: '/docs/swagger.json' }));
// app.disable('x-powered-by') not working for me

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Csrf-Token'],
  }),
);
app.use(cookieParser());
app.use(oAuthRouter);

app.use(authRouter, protectedRouter);

app.listen(PORT, () => {
  console.log(`Server listning on http://localhost:${PORT}`);
});
