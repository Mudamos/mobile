import { connect } from "react-redux";

import { navigateBack } from "../actions";
import { privacyPolicyURL } from "../selectors";

import WebViewLayout from "../components/web-view-layout";

/**
 * Because mudamos.org displays a landing page when the user
 * does not have an specific cookie, which tracks if the landing page has
 * been displayed, we have to hack in order to skip it.
 *
 * A simple solution for now is just reload the page, therefore the cookie
 * is going to be set on the second time
 */
const skipLandingPage = `
    (function() {
      window.location.reload();
    })();
`;
const mapStateToProps = state => ({
  injectedJavaScript: skipLandingPage,
  source: {
    uri: privacyPolicyURL(state),
  },
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
});


export default connect(mapStateToProps, mapDispatchToProps)(WebViewLayout);

