import React, { Component, PropTypes } from "react";

import {
  ListView,
  RefreshControl,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { moment } from "../utils";

import Icon from "react-native-vector-icons/MaterialIcons";

import Layout from "./layout";
import PageLoader from "./page-loader";
import NavigationBar from "./navigation-bar";
import RetryButton from "./retry-button";
import HeaderLogo from "./header-logo";

import styles from "../styles/plips-layout";

import locale from "../locales/pt-BR";


export default class PlipsLayout extends Component {
  static propTypes = {
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlips: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    nextPage: PropTypes.number,
    openMenu: PropTypes.func.isRequired,
    plipsDataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    onFetchPlips: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
  }

  render() {
    const {
      errorFetchingPlips,
      isFetchingPlips,
    } = this.props;

    return (
      <View style={styles.full}>
        <Layout>
          {this.renderNavBar()}
          {!errorFetchingPlips && this.renderListView()}
          {errorFetchingPlips && this.renderRetry()}
        </Layout>

        <PageLoader isVisible={isFetchingPlips} />
      </View>
    );
  }

  renderListView() {
    const {
      plipsDataSource,
      isRefreshing,
      onFetchPlips,
      onRefresh,
    } = this.props;

    return (
      <ListView
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        onEndReached={onFetchPlips}
        onEndReachedThreshold={300}
        dataSource={plipsDataSource}
        renderHeader={this.renderHeader.bind(this)}
        renderRow={this.renderRow.bind(this)}
        renderSeparator={this.renderSeparator.bind(this)}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
      />
    );
  }

  renderHeader() {
    const { plipsDataSource } = this.props;
    if (plipsDataSource.getRowCount() > 0) return null;

    return (
      <View style={styles.noProjectsHeader}>
        <Text style={styles.noProjects}>{locale.noProjectsFound}</Text>
        <Text style={styles.noProjects}>{locale.pullToRefresh}</Text>
      </View>
    );
  }

  renderRow(plip, section, row, highlightRow) {
    const { onGoToPlip } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          highlightRow(section, row);
          onGoToPlip(plip);
        }}
        style={styles.tableRow}
      >
        <Text style={styles.userName}>
          {plip.phase.name}
        </Text>
      </TouchableOpacity>
    );
  }

  renderSeparator(sectionID, rowID) {
    return <View
      key={`sep:${sectionID}:${rowID}`}
      style={styles.separator}
    />
  }

  renderNavBar() {
    return (
      <NavigationBar
        containerStyle={styles.navigationBar}
        leftView={this.renderMenuButton()}
        middleView={<HeaderLogo />}
      />
    );
  }

  renderMenuButton() {
    const { openMenu } = this.props;

    return (
      <TouchableOpacity
        onPress={openMenu}
      >
        <Icon
          name="dehaze"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    );
  }

  renderRetry() {
    const { onRetryPlips } = this.props;

    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={onRetryPlips}
          style={{marginHorizontal: 20, backgroundColor: "#ddd"}}
        />
      </View>
    );
  }

  formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
}
