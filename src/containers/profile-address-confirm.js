import { connect } from "react-redux";

import ProfileAddressConfirmLayout from "../components/profile-address-confirm-layout";

import {
  navigateBack,
  saveZipCode,
} from "../actions";

import {
  fetchLocation,
  isSavingProfile,
} from "../selectors";

const mapStateToProps = state => ({
  isSaving: isSavingProfile(state),
  location: fetchLocation(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onSave: location => dispatch(saveZipCode(location)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAddressConfirmLayout);
