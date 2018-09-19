import { connect } from "react-redux";

import IntroLayout from "../components/intro-layout";

import {
  isUserFirstTime,
  isAppReady,
} from "../selectors";

import {
  navigate,
  userFirstTimeDone,
} from "../actions";

const mapStateToProps = state => ({
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
