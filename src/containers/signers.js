import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import {
  ListView,
} from "react-native";

import SignersLayout from "../components/signers-layout";

import {
  clearPlipSigners,
  clearPlipSignersError,
  fetchPlipSigners,
  navigateBack,
} from "../actions";

import {
  getPlipSigners,
  hasSignersFetchError,
  isFetchingPlipSigners,
} from "../selectors";


class Container extends Component {
  state = {
    userDataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }).cloneWithRowsAndSections(this.props.users || {}),
  }

  static propTypes = {
    hasError: PropTypes.bool,
    isFetching: PropTypes.bool,
    plipId: PropTypes.number.isRequired, // Navigation injected
    users: PropTypes.object,
    onFetchSigners: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { plipId, onFetchSigners } = this.props;
    onFetchSigners(plipId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.users !== nextProps.users) {
      this.setState({
        userDataSource: this.state.userDataSource.cloneWithRowsAndSections(nextProps.users || {}),
      });
    }
  }

  render() {
    const { userDataSource } = this.state;
    const { plipId, onFetchSigners } = this.props;

    return <SignersLayout
      {...this.props}

      userDataSource={userDataSource}
      onRetry={() => onFetchSigners(plipId)}
    />
  }
}

const mapStateToProps = state => ({
  hasError: hasSignersFetchError(state),
  isFetching: isFetchingPlipSigners(state),
  users: getPlipSigners(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => {
    dispatch(clearPlipSigners());
    dispatch(clearPlipSignersError());
    dispatch(navigateBack());
  },
  onFetchSigners: plipId => dispatch(fetchPlipSigners(plipId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
