export const isLoggingIn = state => !!state.session.isLoggingIn;

export const currentAuthToken = state => state.session.token;

export const isUserLoggedIn = state => !!state.session.token;

export const authErrorCode = state => state.session.authLoginError;
