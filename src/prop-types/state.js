import PropTypes from "prop-types";

export const StateUfType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  uf: PropTypes.string.isRequired,
});
