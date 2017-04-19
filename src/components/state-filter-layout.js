import React, { Component, PropTypes } from "react";

import {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import startsWith from "lodash/startsWith";
import { remove as removeDiacritics } from "diacritics";

import Icon from "react-native-vector-icons/MaterialIcons";

import Layout from "./layout";
import BackButton from "./back-button";
import NavigationBar from "./navigation-bar";

import locale from "../locales/pt-BR";


export default class StateFilterLayout extends Component {
  state = {
    search: null,
    statesDataSource: this.cloneRows({ dataSource: this.dataSource, states: this.props.states }),
  };

  static propTypes = {
    states: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      uf: PropTypes.string.isRequired,
    })),
    onBack: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  get dataSource() {
    return new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
  }

  componentWillReceiveProps(nextProps) {
    const {
      statesDataSource,
      search,
    } = this.state;

    this.setState({
      statesDataSource: this.cloneRows({ dataSource: statesDataSource, states: this.filterStates({ states: nextProps.states, text: search }) }),
    });
  }

  render() {
    return (
      <View style={styles.full}>
        <Layout>
          {this.renderNavBar()}
          {this.renderSearch()}
          {this.renderListView()}
        </Layout>
      </View>
    );
  }

  renderSearch() {
    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          placeholderTextColor="#AFAFAF"
          selectionColor="#AFAFAF"
          underlineColorAndroid="transparent"
          onChangeText={this.onSearchChange.bind(this)}
          value={this.state.search}
          placeholder={locale.stateName}
        />
      </View>
    );
  }

  renderListView() {
    const { statesDataSource } = this.state;

    return (
      <ListView
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps={true}
        bounces={false}
        enableEmptySections={true}
        dataSource={statesDataSource}
        renderRow={this.renderRow.bind(this)}
        renderSeparator={this.renderSeparator.bind(this)}
        style={styles.full}
      />
    );
  }

  renderRow(state) {
    const { onSelect } = this.props;

    return (
      <TouchableOpacity style={styles.tableRow} onPress={() => onSelect({ state })}>
        <View style={styles.full}>
          <Text style={styles.itemTitle}>{state.name}</Text>
          <Text style={styles.itemSubtitle}>{state.uf}</Text>
        </View>

        <Icon
          name="play-arrow"
          size={16}
          color="#D8D8D8"
        />
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
    const { onBack } = this.props;

    return (
      <NavigationBar
        containerStyle={styles.navigationBar}
        leftView={<BackButton onPress={onBack} />}
        title={locale.stateFilterTitle}
        titleStyle={styles.titleStyle}
      />
    );
  }

  cloneRows({ dataSource, states }) {
    return dataSource.cloneWithRows(states || []);
  }

  onSearchChange(text) {
    const { states } = this.props;
    const { statesDataSource } = this.state;

    this.setState({
      search: text,
      statesDataSource: this.cloneRows({ dataSource: statesDataSource, states: this.filterStates({ states, text }) }),
    });
  }

  filterStates({ states, text }) {
    const search = removeDiacritics(text || "").toLowerCase();
    return states.filter(state => startsWith(removeDiacritics(state.name).toLowerCase(), search));
  }
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  itemTitle: {
    color: "#883DE1",
    fontFamily: "roboto",
    fontSize: 18,
    fontWeight: "500",
  },
  itemSubtitle: {
    color: "#838383",
    fontFamily: "roboto",
    fontSize: 11,
  },
  navigationBar: {
    backgroundColor: "#883DE1",
    height: 64,
  },
  search: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ECECEC",
    fontFamily: "roboto",
    fontSize: 16,
    color: "#AFAFAF",
    paddingHorizontal: 20,
  },
  searchContainer: {
    padding: 8,
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  separator: {
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 66,
    paddingVertical: 15,
    paddingLeft: 12,
    paddingRight: 20,
  },
  titleStyle: {
    fontFamily: "pt sans",
    fontSize: 20,
  },
})
