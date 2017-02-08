import { connect } from "react-redux";

import ProfileAddressLayout from "../components/profile-address-layout";

import { extractNumbers } from "../utils";

import {
  addressClear,
  addressZipCodeSearch,
  openURL,
  saveZipCode,
} from "../actions";

import {
  isSearchingZipCode,
  fetchLocation,
  isSavingProfile,
} from "../selectors";

const CORREIOS_URL = "http://m.correios.com.br/movel/buscaCep.do";

const mapStateToProps = state => ({
  isSearching: isSearchingZipCode(state),
  isSaving: isSavingProfile(state),
  location: fetchLocation(state),
});

const mapDispatchToProps = dispatch => ({
  onClearLocation: () => dispatch(addressClear()),
  onDontKnowZipCode: () => dispatch(openURL(CORREIOS_URL)),
  onSave: location => dispatch(saveZipCode(location)),
  onSearch: zipCode => dispatch(addressZipCodeSearch(extractNumbers(zipCode))),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAddressLayout);
