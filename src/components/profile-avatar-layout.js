import React, { Component, PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import FlatButton from "./flat-button";
import NavigationBar from "./navigation-bar";
import Avatar from "./avatar";

import ImagePicker from "react-native-image-picker";

import locale from "../locales/pt-BR";

import styles from "../styles/profile-avatar-layout";

import { log } from "../utils";


export default class ProfileAvatarLayout extends Component {
  state = {
    avatar: null,
  }

  static propTypes = {
    onRequestAvatarPermission: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { onRequestAvatarPermission } = this.props;
    onRequestAvatarPermission();
  }

  render() {
    const { avatar } = this.state;

    return (
      <View style={styles.container}>
        <Layout>
          <View style={styles.full}>
            {this.renderNavBar()}

            <Text style={styles.headerTitle}>
              {locale.chooseAvatar}
            </Text>

            <View style={styles.avatarContainer}>
              <Avatar
                source={avatar}
                onPress={this.selectAvatar.bind(this)}
              />
            </View>

            <View style={styles.full}>
              <FlatButton
                title={locale.forward.toUpperCase()}
                onPress={() => {}}
                style={{marginHorizontal: 20, marginTop: 20}}
              />
          </View>
          </View>
        </Layout>

        <PageLoader isVisible={false} />
      </View>
    );
  }

  renderNavBar() {
    return (
      <NavigationBar
        middleView={<HeaderLogo />}
      />
    );
  }

  selectAvatar() {
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
      log(uri, { tag: "avatar uri" });

      this.setState({
        avatar: {
          uri,
        },
      });
    });
  }
}
