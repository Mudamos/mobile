import { PropTypes } from "react";

export const RemoteLinksType = PropTypes.shape({
  getToKnowMudamos: PropTypes.string.isRequired,
  help: PropTypes.string.isRequired,
  sendYourIdea: PropTypes.string.isRequired,
  whyProjectsLink: PropTypes.string.isRequired,
});
