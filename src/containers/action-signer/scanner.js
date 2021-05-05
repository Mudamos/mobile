import { connect } from "react-redux";

import { navigateBack, qrCodeScannedData } from "../../actions";
import { appInForeground } from "../../selectors";
import Layout from "../../components/action-signer/scanner-layout";

const maptStateToProps = (state) => ({
  hasFocus: appInForeground(state),
});

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch(navigateBack()),
  onQrCodeScan: (data) => dispatch(qrCodeScannedData({ data })),
});

export default connect(maptStateToProps, mapDispatchToProps)(Layout);
