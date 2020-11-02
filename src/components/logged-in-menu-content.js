import PropTypes from "prop-types";
import React, { Component } from "react";

import ListView from "deprecated-react-native-listview";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Spinner from "react-native-spinkit";
import Icon from "react-native-vector-icons/MaterialIcons";
import HeaderLogo from "./header-logo";
import Avatar from "./avatar";
import SafeAreaView from "./safe-area-view";

import ImagePicker from "react-native-image-picker";

import styles from "../styles/logged-in-menu";
import { baseName, log } from "../utils";

import locale from "../locales/pt-BR";


export default class Menu extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    isFetchingProfile: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    menuEntries: PropTypes.array.isRequired,
    onAvatarChanged: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
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

  get avatar() {
    const { currentUser } = this.props;
    const { newAvatar } = this.state;

    if (newAvatar) return newAvatar;
    if (currentUser && currentUser.avatar.url) return { uri: currentUser.avatar.url };
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
        {
          currentUser &&
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
        }

        { !currentUser && <HeaderLogo /> }

        { isFetchingProfile && this.renderLoader() }
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
        style={styles.rowContainer}
      >
        <View style={styles.row}>
          <Icon
            name={entry.icon}
            size={24}
            color="rgba(255, 255, 255, .2)"
            style={styles.icon}
          />
          <Text style={styles.mediumText}>
            {entry.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  menuSelected(entry) {
    entry.action();
  }

  renderFooter() {
    const { isFetchingProfile, isUserLoggedIn } = this.props;
    return isFetchingProfile || !isUserLoggedIn ? null : this.renderEnabledFooter();
  }

  renderEnabledFooter() {
    const { onLogout } = this.props;

    return (
      <TouchableOpacity
        onPress={onLogout}
      >
        <View style={styles.footer}>
          <Icon
            name="power-settings-new"
            size={24}
            color="rgba(255, 255, 255, .2)"
            style={styles.icon}
          />
          <Text style={styles.mediumText}>
            {locale.logout}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderLoader() {
    return (
      <View style={styles.loader}>
        <Spinner
          color="#FFFFFF"
          isVisible={true}
          type="Bounce"
          size={50}
        />
        <Text style={styles.loaderText}>
          {locale.loading}
        </Text>
      </View>
    );
  }

  selectAvatar = () => {
    const { onAvatarChanged } = this.props;

    ImagePicker.showImagePicker({
      title: locale.chooseAvatar,
      cancelButtonTitle: locale.cancel,
      takePhotoButtonTitle: locale.takePhoto,
      chooseFromLibraryButtonTitle: locale.openGallery,
      mediaType: "photo",
      storageOptions: {
        skipBackup: true,
      },
      allowsEditing: true,
    }, response => {
      if (!response.uri) return;

      const uri = response.uri;
      const name = baseName(uri);
      log(uri, { tag: "avatar uri" });

      const newAvatar = {
        uri,
        name,
        contentType: "image/jpeg",
      };

      this.setState({ newAvatar });

      onAvatarChanged(newAvatar);
    });
  }
}
