import { PropTypes } from "react";

export const SignatureGoalsType = PropTypes.shape({
  currentSignatureGoal: PropTypes.number,
  finalGoal: PropTypes.number,
  initialGoal: PropTypes.number,
});
