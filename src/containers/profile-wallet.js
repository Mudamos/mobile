import PropTypes from "prop-types";
import React, { Component } from "react";
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
    revalidateProfileSignPlip: PropTypes.bool, // Navigation injected
    onCreateWallet: PropTypes.func.isRequired,

    ...WalletLayout.propTypes,
  }

  componentDidMount() {
    const { revalidateProfileSignPlip, onCreateWallet } = this.props;

    if (!revalidateProfileSignPlip) {
      onCreateWallet({ revalidateProfileSignPlip }); // Fire the wallet creation
    }
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
  onCreateWallet: ({ revalidateProfileSignPlip }) => dispatch(createWallet({ revalidateProfileSignPlip })),
  onRetry: () => dispatch(createWallet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
