export const requestUserLocation = ({ message }) => ({
  type: "PERMISSION_REQUEST_LOCATION",
  payload: { message },
});

export const permissionUnauthorized = (permission) => ({
  type: "PERMISSION_UNAUTHORIZED",
  payload: { permission },
});

export const requestAvatarAccess = () => ({
  type: "PERMISSION_REQUEST_AVATAR",
});
