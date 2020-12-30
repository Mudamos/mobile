import { connect } from "react-redux";

import AboutAppLayout from "../components/about-app-layout";

import { aboutAppUserFeedback, findRemoteLinks } from "../selectors";

import { userAboutAppFeedback, logEvent, navigate, openURL } from "../actions";

const mapStateToProps = (state) => ({
  remoteLinks: findRemoteLinks(state),
  localFeedback: aboutAppUserFeedback(state),
});

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch(navigate("plipsNav")),
  onLogEvent: ({ name, extraData }) => dispatch(logEvent({ name, extraData })),
  onOpenURL: (url) => dispatch(openURL(url)),
  onSetFeedback: ({ questionAnsweredKey, answer }) =>
    dispatch(userAboutAppFeedback({ questionAnsweredKey, answer })),
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutAppLayout);
