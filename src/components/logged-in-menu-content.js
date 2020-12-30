import PropTypes from "prop-types";
import React, { Component } from "react";
import { equals, cond, T, identity } from "ramda";

import ListView from "deprecated-react-native-listview";
import { Text, TouchableOpacity, View } from "react-native";

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

export default class Menu extends Component {
  static propTypes = {
    authorizedPermission: PropTypes.string,
    currentUser: PropTypes.object,
    isFetchingProfile: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    menuEntries: PropTypes.array.isRequired,
    permission: PermissionShape.isRequired,
    showActionSheetWithOptions: PropTypes.func.isRequired,
    onAvatarChanged: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onRequestCameraPermission: PropTypes.func.isRequired,
    onRequestGalleryPermission: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      entries: this.dataSource.cloneWithRows(this.props.menuEntries),
      newAvatar: null,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.menuEntries !== undefined) {
      this.setState({
        entries: this.dataSource.cloneWithRows(newProps.menuEntries),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { authorizedPermission } = this.props;

    if (
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
    return (
      <View style={styles.menuListContainer}>
        <ListView
          bounces={false}
          dataSource={this.state.entries}
          renderRow={this.renderMenuEntry}
          style={styles.full}
        />
      </View>
    );
  }

  renderMenuEntry = (entry, section, row, highlightRow) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.menuSelected(entry);
          highlightRow(section, row);
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

  menuSelected(entry) {
    entry.action();
  }

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

  onImageResult = ({ didCancel, errorCode, uri }) => {
    const { onAvatarChanged } = this.props;

    log({ didCancel, errorCode }, { tag: "avatar" });

    if (didCancel || !uri) return;

    const name = baseName(uri);
    log(uri, { tag: "avatar" }, { errorCode });

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
