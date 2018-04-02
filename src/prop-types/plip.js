import PropTypes from "prop-types";

export const SignatureGoalsType = PropTypes.shape({
  currentSignatureGoal: PropTypes.number,
  finalGoal: PropTypes.number,
  initialGoal: PropTypes.number,
});
