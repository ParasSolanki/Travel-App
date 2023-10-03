/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import('./lib/lucia').Auth;
  type DatabaseUserAttributes = {
    name?: string;
    email: string;
    roleId: string;
    createdAt?: string;
    updateAt?: string;
  };
  type DatabaseSessionAttributes = {};
}
