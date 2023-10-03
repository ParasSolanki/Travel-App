import { prisma } from '@travel-app/db';
import { protectedRouter } from '../protected-app.js';
import { isAdmin } from '../utils/is-admin.js';

// get agents
protectedRouter.get('/api/agents', async (req, res) => {
  const { search, page, perPage } = req.query;

  try {
    const where = {
      AND: [
        {
          deletedAt: null,
        },
        {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { address: { contains: search } },
            { phoneNumber: { contains: search } },
          ],
        },
      ],
    };

    const [total, agents] = await prisma.$transaction([
      prisma.agent.count({
        where,
      }),
      prisma.agent.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: perPage,
        skip: page > 0 ? perPage * page : 0,
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
        },
      }),
    ]);

    res.status(200).json({
      ok: true,
      data: {
        agents,
        pagination: {
          page,
          total: Math.ceil(total / perPage),
        },
      },
    });
  } catch (e) {
    req.log.error({ error: e });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// get all agents
protectedRouter.get('/api/agents/all', async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
      },
    });

    res.status(200).json({
      ok: true,
      data: {
        agents,
      },
    });
  } catch (e) {
    req.log.error({ error: e });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// add agent
protectedRouter.post('/api/agents', async (req, res) => {
  const user = res.locals.user;
  const { name, address, email, phoneNumber } = req.body;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  try {
    const agent = await prisma.agent.create({
      data: {
        name,
        address,
        email,
        phoneNumber,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
      },
    });

    res.status(201).json({
      ok: true,
      data: {
        agent,
      },
    });
  } catch (e) {
    req.log.error({ error: e });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// update agent
protectedRouter.put('/api/agent/:id', async (req, res) => {
  const id = req.params.id;
  const user = res.locals.user;
  const { name, address, email, phoneNumber } = req.body;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  try {
    const agent = await prisma.agent.findFirst({ where: { id } });

    if (!agent) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Agent not found',
        },
      });
    }

    await prisma.agent.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phoneNumber,
        address,
        updatedBy: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    res.status(200).json({
      ok: true,
    });
  } catch (e) {
    req.log.error({ error: e });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// delete agent
protectedRouter.delete('/api/agent/:id', async (req, res) => {
  const id = req.params.id;
  const user = res.locals.user;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  try {
    const agent = await prisma.agent.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    // if agent has deleted at means its already deleted send 404 because we have soft deleted it
    if (!agent || agent?.deletedAt) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Agent not found',
        },
      });
    }

    await prisma.agent.update({
      where: {
        id,
      },
      data: {
        updatedBy: {
          connect: {
            id: user.id,
          },
        },
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      ok: true,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});
