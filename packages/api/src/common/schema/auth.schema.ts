import { z } from 'zod';

export const signinErrorTypes = {
  OAUTH_CALLBACK: 'OAuthCallback',
  OAUTH_SIGNIN: 'OAuthSignin',
};

export const signinErrorTypeSchema = z.union([
  z.literal('OAuthCallback'),
  z.literal('OAuthSignin'),
]);

type SigninErrorTypes = z.infer<typeof signinErrorTypeSchema>;
type SigninErrors = {
  [key in SigninErrorTypes]: string;
};

export const signinErrorMessages = {
  OAuthCallback: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
} satisfies SigninErrors;
