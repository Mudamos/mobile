import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import ProfileAddressLayout from "../components/profile-address-layout";

import { extractNumbers } from "../utils";

import {
  addressZipCodeSearch,
  addressZipCodeSearchWithCoords,
  openURL,
  requestUserLocation,
} from "../actions";

import {
  getUserLocation,
  isFetchingLocation,
  isSearchingZipCode,
} from "../selectors";

const CORREIOS_URL = "http://m.correios.com.br/movel/buscaCep.do";

class Container extends Component {
  static propTypes = {
    isSearching: PropTypes.bool,
    userLocation: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    onSearchZipCodeWithCoords: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const isSearching = nextProps.isSearching || this.props.isSearching;

    if (!isSearching && nextProps.userLocation && !this.props.userLocation) {
      this.props.onSearchZipCodeWithCoords(nextProps.userLocation);
    }
  }

  render() {
    return <ProfileAddressLayout {...this.props} />
  }
}

const mapStateToProps = state => ({
  isFetchingLocation: isFetchingLocation(state),
  isSearching: isSearchingZipCode(state),
  userLocation: getUserLocation(state),
});

const mapDispatchToProps = dispatch => ({
  onDontKnowZipCode: () => dispatch(openURL(CORREIOS_URL)),
  onRequestLocation: ({ message }) => dispatch(requestUserLocation({ message })),
  onSearch: zipCode => dispatch(addressZipCodeSearch(extractNumbers(zipCode))),
  onSearchZipCodeWithCoords: ({ latitude, longitude }) => dispatch(addressZipCodeSearchWithCoords({ latitude, longitude })),
})

export default connect(mapStateToProps, mapDispatchToProps)(Container);
