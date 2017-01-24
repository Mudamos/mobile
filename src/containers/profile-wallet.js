import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { Alert } from "react-native";

import WalletLayout from "../components/profile-wallet-layout";
import locale from "../locales/pt-BR";

import {
  createWallet,
} from "../actions";

import {
  hasWalletCreationError,
  isCreatingWallet,
} from "../selectors";

class Container extends Component {
  static propTypes = {
    alertRevalidate: PropTypes.bool, // Navigation injected
    onCreateWallet: PropTypes.func.isRequired,

    ...WalletLayout.propTypes,
  }

  static defaultProps = {
    alertRevalidate: false,
  }

  componentWillMount() {
    const { alertRevalidate, onCreateWallet } = this.props;

    if (alertRevalidate) {
      this.fireAlertRevalidate();
    } else {
      onCreateWallet(); // Fire the wallet creation
    }
  }

  render() {
    return (
      <WalletLayout
        {...this.props}
      />
    );
  }

  fireAlertRevalidate() {
    const { onCreateWallet } = this.props;

    Alert.alert(
      locale.revalidation,
      locale.revalidationExplanation,
      [
        { text: locale.ok, onPress: onCreateWallet },
      ],
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
