import PropTypes from "prop-types";

export const TabViewType = PropTypes.shape({
  index: PropTypes.number.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
});
