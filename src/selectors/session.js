export const isLoggingIn = state => !!state.session.isLoggingIn;

export const currentAuthToken = state => state.session.token;
