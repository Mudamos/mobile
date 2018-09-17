import { connect } from "react-redux";

import HelpLayout from "../components/help-layout";

import {
  currentUser,
  findRemoteLinks,
} from "../selectors";

import {
  logEvent,
  navigate,
  openURL,
} from "../actions";

const mapStateToProps = state => ({
  currentUser: currentUser(state),
  remoteLinks: findRemoteLinks(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () =>  dispatch(navigate("plipsNav")),
  onLogEvent: ({ name, extraData }) => dispatch(logEvent({ name, extraData })),
  onOpenURL: url => dispatch(openURL(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpLayout);
