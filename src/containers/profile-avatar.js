import { connect } from "react-redux";

import ProfileAvatarLayout from "../components/profile-avatar-layout";

import {
  profileSaveAvatar,
  requestAvatarAccess,
} from "../actions";


const mapDispatchToProps = dispatch => ({
  onRequestAvatarPermission: () => dispatch(requestAvatarAccess()),
  onSubmit: ({ avatar }) => dispatch(profileSaveAvatar({ avatar })),
});

export default connect(null, mapDispatchToProps)(ProfileAvatarLayout);
