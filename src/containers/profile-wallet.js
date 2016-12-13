import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import WalletLayout from "../components/profile-wallet-layout";

import {
  createWallet,
} from "../actions";

import {
  hasWalletCreationError,
  isCreatingWallet,
} from "../selectors";

class Container extends Component {
  static propTypes = {
    onCreateWallet: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    props.onCreateWallet(); // Fire the wallet creation
  }

  render() {
    return (
      <WalletLayout
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  hasError: hasWalletCreationError(state),
  isCreatingWallet: isCreatingWallet(state),
});

const mapDispatchToProps = dispatch => ({
  onCreateWallet: () => dispatch(createWallet()),
  onRetry: () => dispatch(createWallet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
