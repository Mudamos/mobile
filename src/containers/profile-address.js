import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import ProfileAddressLayout from "../components/profile-address-layout";

import { extractNumbers } from "../utils";

import {
  addressZipCodeSearch,
  addressZipCodeSearchWithCoords,
  navigate,
  openURL,
  requestUserLocation,
  saveZipCode,
} from "../actions";

import {
  fetchLocation,
  getUserLocation,
  isFetchingLocation,
  isSavingProfile,
  isSearchingZipCode,
} from "../selectors";

const CORREIOS_URL = "http://www.buscacep.correios.com.br/sistemas/buscacep/buscaCepEndereco.cfm";

class Container extends Component {
  static propTypes = {
    isSearching: PropTypes.bool,
    userLocation: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    onSearchZipCodeWithCoords: PropTypes.func.isRequired,
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
  isSaving: isSavingProfile(state),
  isSearching: isSearchingZipCode(state),
  userLocation: getUserLocation(state),
  location: fetchLocation(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigate("plipsNav")),
  onDontKnowZipCode: () => dispatch(openURL(CORREIOS_URL)),
  onOpenURL: url => dispatch(openURL(url)),
  onRequestLocation: ({ message }) => dispatch(requestUserLocation({ message })),
  onSave: location => dispatch(saveZipCode(location)),
  onSearch: zipCode => {dispatch(addressZipCodeSearch(extractNumbers(zipCode)))},
  onSearchZipCodeWithCoords: ({ latitude, longitude }) => dispatch(addressZipCodeSearchWithCoords({ latitude, longitude })),
})

export default connect(mapStateToProps, mapDispatchToProps)(Container);
