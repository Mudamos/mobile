import PropTypes from "prop-types";
import React, { Component } from "react";
import { equals, cond, T, identity, includes } from "ramda";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import Spinner from "react-native-spinkit";
import Icon from "react-native-vector-icons/MaterialIcons";
import HeaderLogo from "./header-logo";
import Avatar from "./avatar";
import SafeAreaView from "./safe-area-view";
import { AUTHORIZED } from "../services/permission";
import { PermissionShape } from "../providers/permisson-provider";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import styles from "../styles/logged-in-menu";
import { baseName, log } from "../utils";

import locale from "../locales/pt-BR";

const sheetOptions = [locale.takePhoto, locale.openGallery, locale.cancel];
const cameraIndexSheetIndex = 0;
const gallerySheetIndexSheetIndex = 1;
const cancelButtonSheetIndex = 2;

const mediaOptions = {
  mediaType: "photo",
};

const hasPermission = includes;

export default class Menu extends Component {
  state = {
    newAvatar: null,
    requestedPermission: false,
  };

  static propTypes = {
    authorizedPermission: PropTypes.string,
    currentUser: PropTypes.object,
    isFetchingProfile: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    menuEntries: PropTypes.array.isRequired,
    permission: PermissionShape.isRequired,
    showActionSheetWithOptions: PropTypes.func.isRequired,
    unauthorizedPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onAvatarChanged: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onRemoveUnauthorizedPermission: PropTypes.func.isRequired,
    onRequestCameraPermission: PropTypes.func.isRequired,
    onRequestGalleryPermission: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(
    { unauthorizedPermissions, permission: { service } },
    { requestedPermission },
  ) {
    if (
      requestedPermission &&
      (hasPermission(service.permissions.camera, unauthorizedPermissions) ||
        hasPermission(service.permissions.photo, unauthorizedPermissions))
    ) {
      return { requestedPermission: false };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const { authorizedPermission } = this.props;
    const { requestedPermission } = this.state;

    if (
      requestedPermission &&
      authorizedPermission &&
      authorizedPermission !== prevProps.authorizedPermission
    ) {
      this.continueAvatarFlow(authorizedPermission);
    }
  }

  get avatar() {
    const { currentUser } = this.props;
    const { newAvatar } = this.state;

    if (newAvatar) return newAvatar;
    if (currentUser && currentUser.avatar.url) {
      return { uri: currentUser.avatar.url };
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderHeader()}
        {this.renderTable()}
        {this.renderFooter()}
      </SafeAreaView>
    );
  }

  renderHeader() {
    const { currentUser, isFetchingProfile } = this.props;

    return (
      <View style={styles.menuHeaderContainer}>
        {currentUser && (
          <View style={styles.profileInfoContainer}>
            <Avatar
              source={this.avatar}
              onPress={this.selectAvatar}
              size={56}
              avatarStyle={styles.avatar}
            />

            <View style={styles.userNameContainer}>
              <Text style={styles.userName} numberOfLines={2}>
                {currentUser.name}
              </Text>

              <Text style={styles.darkSmallText} numberOfLines={2}>
                {currentUser.email}
              </Text>
            </View>
          </View>
        )}

        {!currentUser && <HeaderLogo />}

        {isFetchingProfile && this.renderLoader()}
      </View>
    );
  }

  renderTable() {
    const { menuEntries } = this.props;

    return (
      <View style={styles.menuListContainer}>
        <FlatList
          bounces={false}
          data={menuEntries}
          renderItem={this.renderMenuEntry}
          keyExtractor={this.keyExtractor}
          style={styles.full}
        />
      </View>
    );
  }

  keyExtractor = (item) => item.icon;

  renderMenuEntry = ({ item: entry }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.menuSelected(entry);
        }}
        style={styles.rowContainer}>
        <View style={styles.row}>
          <Icon
            name={entry.icon}
            size={24}
            color="rgba(255, 255, 255, .2)"
            style={styles.icon}
          />
          <Text style={styles.mediumText}>{entry.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  menuSelected = (entry) => {
    entry.action();
  };

  renderFooter() {
    const { isFetchingProfile, isUserLoggedIn } = this.props;
    return isFetchingProfile || !isUserLoggedIn
      ? null
      : this.renderEnabledFooter();
  }

  renderEnabledFooter() {
    const { onLogout } = this.props;

    return (
      <TouchableOpacity onPress={onLogout}>
        <View style={styles.footer}>
          <Icon
            name="power-settings-new"
            size={24}
            color="rgba(255, 255, 255, .2)"
            style={styles.icon}
          />
          <Text style={styles.mediumText}>{locale.logout}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderLoader() {
    return (
      <View style={styles.loader}>
        <Spinner color="#FFFFFF" isVisible={true} type="Bounce" size={50} />
        <Text style={styles.loaderText}>{locale.loading}</Text>
      </View>
    );
  }

  isPermissionGranted = (permission) =>
    this.props.permission.service
      .checkStatus(permission)
      .then(equals(AUTHORIZED));

  continueAvatarFlow = (authorizedPermission) => {
    const {
      permission: { service },
    } = this.props;

    cond([
      [
        equals(service.permissions.camera),
        () => {
          launchCamera(mediaOptions, this.onImageResult);
        },
      ],
      [
        equals(service.permissions.photo),
        () => {
          launchImageLibrary(mediaOptions, this.onImageResult);
        },
      ],
    ])(authorizedPermission);
  };

  onImageResult = ({ didCancel, errorCode, errorMessage, uri }) => {
    const { onAvatarChanged } = this.props;

    this.setState({ requestedPermission: false });

    log({ didCancel, errorCode, errorMessage }, { tag: "avatar menu" });

    if (didCancel || !uri) return;

    const name = baseName(uri);
    log(uri, { tag: "avatar menu" }, { errorCode });

    const newAvatar = {
      uri,
      name,
      contentType: "image/jpeg",
    };

    this.setState({ newAvatar });

    onAvatarChanged(newAvatar);
  };

  selectAvatar = () => {
    const {
      onRequestCameraPermission,
      onRequestGalleryPermission,
      onRemoveUnauthorizedPermission,
      showActionSheetWithOptions,
      permission: { service },
    } = this.props;

    showActionSheetWithOptions(
      {
        options: sheetOptions,
        cancelButtonIndex: cancelButtonSheetIndex,
      },
      (buttonIndex) => {
        log("Sheet index", { tag: "Sheet" }, { buttonIndex });

        cond([
          [
            equals(cameraIndexSheetIndex),
            async () => {
              const isGranted = await this.isPermissionGranted(
                service.permissions.camera,
              );

              log({ isGranted }, { tag: "camera" });

              if (isGranted) {
                this.continueAvatarFlow(service.permissions.camera);
              } else {
                onRemoveUnauthorizedPermission(service.permissions.camera);
                this.setState({ requestedPermission: true });

                onRequestCameraPermission();
              }
            },
          ],
          [
            equals(gallerySheetIndexSheetIndex),
            async () => {
              const isGranted = await this.isPermissionGranted(
                service.permissions.photo,
              );

              log({ isGranted }, { tag: "photo" });

              if (isGranted) {
                this.continueAvatarFlow(service.permissions.photo);
              } else {
                onRemoveUnauthorizedPermission(service.permissions.photo);
                this.setState({ requestedPermission: true });

                onRequestGalleryPermission();
              }
            },
          ],
          [T, identity],
        ])(buttonIndex);
      },
    );
  };
}
