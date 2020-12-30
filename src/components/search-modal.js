import PropTypes from "prop-types";
import React, { Component } from "react";

import { StyleSheet, TouchableOpacity } from "react-native";

import SearchBar from "./search-bar";
import SafeAreaView from "./safe-area-view";

import locale from "../locales/pt-BR";

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, .4)",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    elevation: 8,
  },
});

class SearchModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    searchTitle: PropTypes.string,
    onClearSearch: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onToggleModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isVisible: false,
  };

  componentDidUpdate(prevProps) {
    const { searchTitle } = this.props;
    const { input: searchBarInput } =
      (this.searchBar && this.searchBar.state) || {};

    if (this.props.isVisible !== prevProps.isVisible && this.searchBar) {
      if (this.props.isVisible) {
        this.searchBar.show();

        if (searchBarInput !== searchTitle) {
          this.searchBar.setValue(searchTitle);
        }
      }
    }
  }

  onSearch = () => {
    const { onSearch, onToggleModal } = this.props;

    this.searchBar && onSearch(this.searchBar.getValue());
    onToggleModal();
  };

  setSearchBar = (ref) => (this.searchBar = ref);

  render() {
    const { isVisible, onClearSearch, onSearch, onToggleModal } = this.props;

    if (!isVisible) return null;

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.background} onPress={onToggleModal} />
        <SearchBar
          ref={this.setSearchBar}
          onBack={onClearSearch}
          handleChangeText={onSearch}
          placeholder={locale.typeCityOrProjectLaw}
          backgroundColor="#6000AA"
          iconColor="#6000AA"
          fontSize={15}
          onSubmitEditing={this.onSearch}
        />
      </SafeAreaView>
    );
  }
}

export default SearchModal;
