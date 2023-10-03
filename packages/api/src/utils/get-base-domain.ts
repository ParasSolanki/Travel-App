/**
 *
 * @see https://github.com/lucia-auth/lucia/blob/main/packages/lucia/src/utils/url.ts
 */
const getBaseDomain = (host: string): string => {
  if (host.startsWith('localhost:')) return host;
  return host.split('.').slice(-2).join('.');
};
