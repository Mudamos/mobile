import PropTypes from "prop-types";

export const CityType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  uf: PropTypes.string.isRequired,
});
