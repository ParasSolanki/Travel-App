import { zodiosRouter } from '@zodios/express';
import { auth } from './lib/lucia.js';
import { STATUS_CODES } from './constants/status-code.js';
import { getSessionUserData } from './common/services/user.service.js';
import { meApi } from './common/api-defs/me.api.js';
import { destinationsApi } from './common/api-defs/destinations.api.js';
import { pickupPointsApi } from './common/api-defs/pickup-points.api.js';
import { usersApi } from './common/api-defs/users.api.js';
import { agentsApi } from './common/api-defs/agents.api.js';
import { hotelsApi } from './common/api-defs/hotels.api.js';

const protectedRouter = zodiosRouter([
  ...meApi,
  ...destinationsApi,
  ...pickupPointsApi,
  ...usersApi,
  ...agentsApi,
  ...hotelsApi,
]);

protectedRouter.use(async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);

  try {
    const session = await authRequest.validate();

    if (!session) {
      return res.status(401).json({
        ok: false,
        error: {
          code: STATUS_CODES[401].code,
          message: 'Not Authorized',
        },
      });
    }

    const user = await getSessionUserData(session.user.userId);

    res.locals.user = user;

    next();
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        code: STATUS_CODES[500].code,
        message: 'Something went wrong',
      },
    });
  }
});

export { protectedRouter };
