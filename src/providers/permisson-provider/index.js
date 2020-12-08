import PropTypes from "prop-types";
import React, { createContext, useContext } from "react";
import PermissionService, {
  AUTHORIZED,
  DENIED,
  OPEN_SETTINGS,
} from "../../services/permission";

const PermissionContext = createContext();
const service = PermissionService();
const providerValue = { service, AUTHORIZED, DENIED, OPEN_SETTINGS };

export const PermissionProvider = ({ children }) => (
  <PermissionContext.Provider value={providerValue}>
    {children}
  </PermissionContext.Provider>
);

export const usePermissionService = () => {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error(
      "PermissionProvider is not setup. It must be set as a parent component.",
    );
  }

  return context;
};

export const connectPermissionService = (Component) => (props) => {
  const context = usePermissionService();

  return <Component {...props} permission={context} />;
};

export const PermissionShape = PropTypes.shape({
  service: PropTypes.object.isRequired,
  AUTHORIZED: PropTypes.string.isRequired,
  DENIED: PropTypes.string.isRequired,
  OPEN_SETTINGS: PropTypes.string.isRequired,
});
