export const getLocationPermission = (state) => state.permission.location;

export const getCurrentAuthorizedPermission = (state) =>
  state.permission.authorized;

export const getUnauthorizedPermissions = (state) =>
  state.permission.unauthorized;
