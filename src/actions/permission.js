export const requestUserLocation = ({ message }) => ({
  type: "PERMISSION_REQUEST_LOCATION",
  payload: { message },
});

export const permissionAuthorized = (permission) => ({
  type: "PERMISSION_AUTHORIZED",
  payload: { permission },
});

export const permissionUnauthorized = (permission) => ({
  type: "PERMISSION_UNAUTHORIZED",
  payload: { permission },
});

export const requestCameraAccess = () => ({
  type: "PERMISSION_REQUEST_CAMERA",
});

export const requestGalleryAccess = () => ({
  type: "PERMISSION_REQUEST_GALLERY",
});
