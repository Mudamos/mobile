import PropTypes from "prop-types";

export const SignatureGoalsType = PropTypes.shape({
  currentSignatureGoal: PropTypes.number,
  finalGoal: PropTypes.number,
  initialGoal: PropTypes.number,
});

export const TabViewType = PropTypes.shape({
  index: PropTypes.number,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string,
    }),
  ),
});
