import { connect } from "react-redux";

import ProfileAvatarLayout from "../components/profile-avatar-layout";

import {
  requestAvatarAccess,
} from "../actions";


const mapDispatchToProps = dispatch => ({
  onRequestAvatarPermission: () => dispatch(requestAvatarAccess()),
});

export default connect(null, mapDispatchToProps)(ProfileAvatarLayout);
