import { connect } from "react-redux";

import SendYourPlLayout from "../components/send-your-pl-layout";

import { findRemoteLinks } from "../selectors";

import { logEvent, navigate, openURL } from "../actions";

const mapStateToProps = (state) => ({
  remoteLinks: findRemoteLinks(state),
});

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch(navigate("plipsNav")),
  onLogEvent: ({ name, extraData }) => dispatch(logEvent({ name, extraData })),
  onOpenURL: (url) => dispatch(openURL(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendYourPlLayout);
