# Travel App

Travel Management App (Admin Panel), where the admin can manage users, destinations, hotels, pickup points, and agents with all bookings.

## Installation

Install Dependencies.

```bash
  pnpm install
```

## Run Locally

To run both WebApp and Api server.

```bash
  pnpm dev
```

To run WebApp Dev Server.

```bash
  pnpm dev:web
```

To build WebApp.

```bash
  pnpm build:web
```

To run API Server.

```bash
  pnpm dev:api
```

## Project Strcture

This project is a monorepo with PNPM workspaces. It has three main projects: a web app with [React](https://react.dev), an API with [ExpressJS](https://expressjs.com/)([Zodios](https://zodios.org/)), and a database([SQLite](https://www.sqlite.org/index.html)) with [Prisma](https://www.prisma.io/).

```
.
|-- apps
|   |-- web             # Web App
|-- packages
|   |-- api             # Api Server
|   |-- db              # Database
└── README.md
```
