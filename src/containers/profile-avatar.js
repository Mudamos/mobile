import { connect } from "react-redux";

import ProfileAvatarLayout from "../components/profile-avatar-layout";

import {
  profileSaveAvatar,
  requestAvatarAccess,
} from "../actions";

import {
  isSavingAvatar,
} from "../selectors";


const mapStateToProps = state => ({
  isSavingAvatar: isSavingAvatar(state),
});

const mapDispatchToProps = dispatch => ({
  onRequestAvatarPermission: () => dispatch(requestAvatarAccess()),
  onSubmit: ({ avatar }) => dispatch(profileSaveAvatar({ avatar })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAvatarLayout);
