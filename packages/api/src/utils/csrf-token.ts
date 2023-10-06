import { createHash, randomBytes } from 'crypto';
import { env } from '../env.js';

/**
 * Inspired by next-auth
 *
 * https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/core/lib/csrf-token.ts#L26
 */

const SEPARATOR = '|';

function generateCsrfTokenHash(csrfToken?: string) {
  return createHash('sha256')
    .update(`${csrfToken}${env.AUTH_SECRET}`)
    .digest('hex');
}

export function createCsrfToken() {
  const csrfToken = randomBytes(32).toString('hex');
  const csrfTokenHash = generateCsrfTokenHash(csrfToken);

  const cookie = `${csrfToken}${SEPARATOR}${csrfTokenHash}`;

  return { cookie, csrfToken };
}

function isValidCsrfToken(cookieValue: string) {
  const [csrfToken, csrfTokenHash] = cookieValue.split(SEPARATOR);
  const expectedCsrfTokenHash = generateCsrfTokenHash(csrfToken);

  return csrfTokenHash === expectedCsrfTokenHash;
}

export function validateCsrfToken(csrfToken: string | string[] | undefined) {
  if (typeof csrfToken !== 'string')
    return { isValid: false, error: 'Not valid csrftoken' };

  let error = undefined;
  const isValid = isValidCsrfToken(csrfToken);

  if (!isValid) error = 'Not valid csrftoken';

  return { isValid, error };
}
