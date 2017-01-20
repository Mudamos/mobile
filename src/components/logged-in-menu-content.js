import React, { Component, PropTypes } from "react";

import {
  ListView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Spinner from "react-native-spinkit";
import Icon from "react-native-vector-icons/MaterialIcons";

import HeaderLogo from "./header-logo";

import styles from "../styles/logged-in-menu";

import locale from "../locales/pt-BR";


export default class Menu extends Component {
  state = {
    entries: [],
  };

  static propTypes = {
    currentUser: PropTypes.object,
    isFetchingProfile: PropTypes.bool,
    menuEntries: PropTypes.array.isRequired,
    onLogout: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.setState({
      entries: this.dataSource.cloneWithRows(this.props.menuEntries),
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.menuEntries !== undefined) {
      this.setState({
        entries: this.dataSource.cloneWithRows(newProps.menuEntries),
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderTable()}
        {this.renderFooter()}
      </View>
    );
  }

  renderHeader() {
    const { currentUser, isFetchingProfile } = this.props;

    return (
      <View style={styles.full}>
        {
          currentUser &&
            <View style={styles.full}>
              <Text style={styles.userName}>
                {currentUser.name}
              </Text>

              <Text style={styles.darkSmallText}>
                {currentUser.email}
              </Text>
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
          renderRow={this.renderMenuEntry.bind(this)}
        />
      </View>
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
    entry.action();
  }

  renderFooter() {
    const { isFetchingProfile, currentUser } = this.props;
    return isFetchingProfile || !currentUser ? null : this.renderEnabledFooter();
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
}
