import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { getUrlBasedOnUserRole } from "~/utils/get-url-based-on-user-role";
import { useAbilityContext } from "./use-ability-context";
import { useNavigate } from "@tanstack/react-router";
import { sessionKeys } from "~/common/queries";

type EmailSigninMethod = "email-signin";
type EmailSignupMethod = "email-signup";
type OAuthMethod = "google";
type AuthMethod = EmailSigninMethod | EmailSignupMethod | OAuthMethod;

type EmailSigninData = Parameters<typeof api.signin>[0];
type EmailSignupData = Parameters<typeof api.signup>[0];
type EmailSigninResponse = Awaited<ReturnType<typeof api.signin>>;
type EmailSignupResponse = Awaited<ReturnType<typeof api.signup>>;
type OAuthResponse = void;

type AuthResponse = EmailSigninResponse | EmailSignupResponse | OAuthResponse;

type AuthData<TMethod extends AuthMethod> = TMethod extends EmailSigninMethod
  ? EmailSigninData
  : TMethod extends EmailSignupMethod
  ? EmailSignupData
  : undefined;

type AuthOptions<TMethod extends AuthMethod> = {
  method: TMethod;
  data: AuthData<TMethod>;
};

async function signin(options: AuthOptions<AuthMethod>): Promise<AuthResponse> {
  const { method, data } = options;

  if (!method) throw new Error("No method passed");

  const res = await api.getCsrfToken();
  const csrfToken = res.data.csrfToken;
  const headers = {
    "X-Csrf-Token": csrfToken,
  };

  if (method === "email-signin") {
    // FIXME: data should infer values from signin data
    return api.signin(data!, { headers });
  } else if (method === "email-signup") {
    // FIXME: data should infer values from signup data
    return api.signup(data!, { headers });
  } else if (method === "google") {
    const res = await api.googleSignin(undefined, { headers });
    const url = res.data.url;
    window.location.href = url;

    if (url.includes("#")) window.location.reload();
  }
}

export function useSignin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const updateAbility = useAbilityContext((s) => s.updateAbility);
  return useMutation({
    mutationKey: ["signin"],
    mutationFn: signin,
    onSuccess(data, variables) {
      if (!data) return;
      if (!data.ok) return;

      toast.success(
        variables.method === "email-signup"
          ? "Signed up successfully"
          : "Signed in successfully",
      );
      queryClient.invalidateQueries({
        queryKey: sessionKeys.get,
      });
      flushSync(() => {
        updateAbility(data.data.user);
      });
      navigate({
        to: getUrlBasedOnUserRole(data.data.user.role.name),
      });
    },
    onError(error, variables) {
      let message =
        variables.method === "email-signup"
          ? "Something went wrong while signing up"
          : "Something went wrong while signing";
      if (error instanceof AxiosError && error.response?.data?.error?.message) {
        message = error.response?.data?.error?.message;
      }
      toast.error(message);
    },
  });
}
