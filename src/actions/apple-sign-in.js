export const appleSignIn = () => ({
  type: "APPLE_SIGN_IN",
});

export const appleSignInError = (error) => ({
  type: "APPLE_SIGN_IN_ERROR",
  payload: { error },
});
