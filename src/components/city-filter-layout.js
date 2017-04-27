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

import { findStateNameByUF } from "../utils";


export default class CityFilterLayout extends Component {
  state = {
    search: null,
    citiesDataSource: this.cloneRows({ dataSource: this.dataSource, cities: this.props.cities }),
  };

  static propTypes = {
    cities: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
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
      citiesDataSource,
      search,
    } = this.state;

    this.setState({
      citiesDataSource: this.cloneRows({ dataSource: citiesDataSource, cities: this.filterCities({ cities: nextProps.cities, text: search }) }),
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
          placeholder={locale.cityName}
        />
      </View>
    );
  }

  renderListView() {
    const { citiesDataSource } = this.state;

    return (
      <ListView
        ref={ref => this.listView = ref}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps={true}
        bounces={false}
        enableEmptySections={true}
        dataSource={citiesDataSource}
        renderRow={this.renderRow.bind(this)}
        renderSeparator={this.renderSeparator.bind(this)}
        style={styles.full}
      />
    );
  }

  renderRow(city) {
    const { onSelect } = this.props;

    return (
      <TouchableOpacity style={styles.tableRow} onPress={() => onSelect({ city })}>
        <View style={styles.full}>
          <Text style={styles.itemTitle}>{city.name}</Text>
          <Text style={styles.itemSubtitle}>{findStateNameByUF(city.uf)}</Text>
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
        title={locale.cityFilterTitle}
        titleStyle={styles.titleStyle}
      />
    );
  }

  cloneRows({ dataSource, cities }) {
    return dataSource.cloneWithRows(cities || []);
  }

  onSearchChange(text) {
    const { cities } = this.props;
    const { citiesDataSource } = this.state;

    this.setState({
      search: text,
      citiesDataSource: this.cloneRows({ dataSource: citiesDataSource, cities: this.filterCities({ cities, text }) }),
    });

    this.listView.scrollTo({y: 0});
  }

  filterCities({ cities, text }) {
    const search = removeDiacritics(text || "").toLowerCase();
    return cities.filter(city => startsWith(removeDiacritics(city.name).toLowerCase(), search));
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
