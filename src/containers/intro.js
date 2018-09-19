import { connect } from "react-redux";

import IntroLayout from "../components/intro-layout";

import {
  appLoadingCompleted,
  isUserFirstTime,
  isAppReady,
} from "../selectors";

import {
  navigate,
  userFirstTimeDone,
} from "../actions";

const mapStateToProps = state => ({
  appLoadingCompleted: appLoadingCompleted(state),
  isUserFirstTime: isUserFirstTime(state),
  isAppReady: isAppReady(state),
});

const mapDispatchToProps = dispatch => ({
  onHome: () => {
    dispatch(navigate("plipsNav"));
    dispatch(userFirstTimeDone());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IntroLayout);
