import { connect } from "react-redux";

import IntroLayout from "../components/intro-layout";

import {
  appLoadingProgress,
  getAppLinkUrl,
  isUserFirstTime,
  isAppReady,
} from "../selectors";

import { handleAppLink, navigate, userFirstTimeDone } from "../actions";

const mapStateToProps = (state) => ({
  appLink: getAppLinkUrl(state),
  appLoadingProgress: appLoadingProgress(state),
  isUserFirstTime: isUserFirstTime(state),
  isAppReady: isAppReady(state),
});

const mapDispatchToProps = (dispatch) => ({
  onHandleAppLink: () => dispatch(handleAppLink()),
  onHome: () => {
    dispatch(navigate("plipsNav"));
    dispatch(userFirstTimeDone());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IntroLayout);
