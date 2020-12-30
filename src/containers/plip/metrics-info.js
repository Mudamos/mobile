import { connect } from "react-redux";

import MetricsLayout from "../../components/plip/metrics-info";

import { isRemainingDaysEnabled } from "../../selectors";

const mapStateToProps = (state) => ({
  isRemainingDaysEnabled: isRemainingDaysEnabled(state),
});

export default connect(mapStateToProps)(MetricsLayout);
