import { connect } from "react-redux";

import ProfileAvatarLayout from "../components/profile-avatar-layout";

import {
  profileSaveAvatar,
  requestAvatarAccess,
} from "../actions";

import {
  isSavingAvatar,
  getCurrentUserAvatar,
} from "../selectors";


const mapStateToProps = state => ({
  isSavingAvatar: isSavingAvatar(state),
  currentAvatar: getCurrentUserAvatar(state),
});

const mapDispatchToProps = dispatch => ({
  onRequestAvatarPermission: () => dispatch(requestAvatarAccess()),
  onSubmit: ({ avatar, oldAvatarURL }) => dispatch(profileSaveAvatar({ avatar, oldAvatarURL })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAvatarLayout);
