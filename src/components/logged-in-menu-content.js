import React, { Component, PropTypes } from "react";

import {
  ListView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Spinner from "react-native-spinkit";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/logged-in-menu";

import locale from "../locales/pt-BR";


export default class Menu extends Component {
  state = {
    entries: [],
  };

  static propTypes = {
    currentUser: PropTypes.object,
    isFetchingProfile: PropTypes.bool,
    onLogout: PropTypes.func.isRequired,
  };

  get menuEntries() {
    return [
      { icon: "account-circle", title: locale.menu.editProfile },
      { icon: "lock", title: locale.menu.changePassword },
    ];
  }

  componentWillMount() {
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.setState({
      entries: this.dataSource.cloneWithRows(this.menuEntries),
    });
  }

  render() {
    const {
      currentUser,
      isFetchingProfile,
    } = this.props;

    return (
      <View style={styles.container}>
        {currentUser && this.renderContent()}
        {isFetchingProfile && this.renderWhenLoading()}
      </View>
    );
  }

  renderContent() {
    const { currentUser } = this.props;

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.userName}>
          {currentUser.name}
        </Text>

        <Text style={styles.darkSmallText}>
          {currentUser.email}
        </Text>

        {this.renderTable()}
        {this.renderFooter()}
      </View>
    );
  }

  renderTable() {
    return (
      <ListView
        bounces={false}
        style={styles.menuList}
        dataSource={this.state.entries}
        renderRow={this.renderMenuEntry.bind(this)}
      />
    );
  }

  renderMenuEntry(entry, section, row, highlightRow) {
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
    console.log("entry", entry);
  }

  renderFooter() {
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

  renderWhenLoading() {
    return (
      <View style={{flex: 1 }}>
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

        {this.renderFooter()}
      </View>
    );
  }
}
