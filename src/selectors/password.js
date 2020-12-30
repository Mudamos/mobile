export const isRetrievingPassword = (state) => state.password.isRetrieving;
export const isChangingPassword = (state) => state.password.isChanging;
export const isChangingForgotPassword = (state) =>
  state.password.isChangingForgot;
export const getChangePasswordErrors = (state) => state.password.changeErrors;
export const getChangeForgotPasswordErrors = (state) =>
  state.password.changeForgotErrors;
