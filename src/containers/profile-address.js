import { connect } from "react-redux";

import ProfileAddressLayout from "../components/profile-address-layout";

import { extractNumbers } from "../utils";

import {
  addressClear,
  addressZipCodeSearch,
  saveZipCode,
} from "../actions";

import {
  isSearchingZipCode,
  fetchLocation,
  isSavingProfile,
} from "../selectors";


const mapStateToProps = state => ({
  isSearching: isSearchingZipCode(state),
  isSaving: isSavingProfile(state),
  location: fetchLocation(state),
});

const mapDispatchToProps = dispatch => ({
  onClearLocation: () => dispatch(addressClear()),
  onSave: location => dispatch(saveZipCode(location)),
  onSearch: zipCode => dispatch(addressZipCodeSearch(extractNumbers(zipCode))),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAddressLayout);
