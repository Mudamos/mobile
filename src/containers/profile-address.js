import { connect } from "react-redux";

import ProfileAddressLayout from "../components/profile-address-layout";

import { extractNumbers } from "../utils";

import {
  addressZipCodeSearch,
  openURL,
} from "../actions";

import {
  isSearchingZipCode,
} from "../selectors";

const CORREIOS_URL = "http://m.correios.com.br/movel/buscaCep.do";

const mapStateToProps = state => ({
  isSearching: isSearchingZipCode(state),
});

const mapDispatchToProps = dispatch => ({
  onDontKnowZipCode: () => dispatch(openURL(CORREIOS_URL)),
  onSearch: zipCode => dispatch(addressZipCodeSearch(extractNumbers(zipCode))),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAddressLayout);
