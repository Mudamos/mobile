import React, { Component, PropTypes } from "react";

import {
  ListView,
  Text,
  View,
} from "react-native";

import { moment } from "../utils";

import Layout from "./layout";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import NavigationBar from "./navigation-bar";
import NetworkImage from "./network-image";
import RetryButton from "./retry-button";

import locale from "../locales/pt-BR";

import styles from "../styles/signers-layout";


export default class SignersLayout extends Component {
  static propTypes = {
    hasError: PropTypes.bool,
    isFetching: PropTypes.bool,
    userDataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    onBack: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
  }

  render() {
    const { hasError, isFetching } = this.props;

    return (
      <View style={styles.full}>
        <Layout>
          {this.renderNavBar()}
          {!hasError && this.renderListView()}
          {hasError && this.renderRetry()}
        </Layout>

        <PageLoader isVisible={isFetching} />
      </View>
    );
  }

  renderListView() {
    const { userDataSource } = this.props;

    return (
      <ListView
        automaticallyAdjustContentInsets={false}
        bounces={false}
        dataSource={userDataSource}
        renderRow={this.renderRow.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
        renderSeparator={this.renderSeparator.bind(this)}
      />
    );
  }

  renderRow(user) {
    return (
      <View style={styles.tableRow}>
        <NetworkImage
          source={{uri: user.pictureUrl}}
          style={styles.avatar}
        />

        <View style={styles.full}>
          <Text style={styles.userName}>
            {user.name}
          </Text>
          <Text style={styles.signDate}>
            {this.formatDate(user.signedAt)}
          </Text>
        </View>
      </View>
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.tableSection}>
        <Text style={styles.section}>
          {sectionID.toUpperCase()}
        </Text>
      </View>
    );
  }

  renderSeparator(sectionID, rowID) {
    return <View
      key={`sep:${sectionID}:${rowID}`}
      style={styles.separator}
    />
  }

  renderNavBar() {
    const { onBack } = this.props;

    return (
      <NavigationBar
        containerStyle={styles.navigationBar}
        leftView={<BackButton onPress={onBack} />}
        title={locale.signersTitle}
      />
    );
  }

  renderRetry() {
    const { onRetry } = this.props;

    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={onRetry}
          style={{marginHorizontal: 20, backgroundColor: "#ddd"}}
        />
      </View>
    );
  }

  formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
}
