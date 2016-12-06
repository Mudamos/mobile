import { connect } from "react-redux";

import ProfileAddressLayout from "../components/profile-address-layout";

import { extractNumbers } from "../utils";

import {
  addressZipCodeSearch,
} from "../actions";

import {
  isSearchingZipCode,
  fetchLocation,
} from "../selectors";


const mapStateToProps = state => ({
  isSearching: isSearchingZipCode(state),
  location: fetchLocation(state),
});

const mapDispatchToProps = dispatch => ({
  onSearch: zipCode => dispatch(addressZipCodeSearch(extractNumbers(zipCode))),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAddressLayout);
