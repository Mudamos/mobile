import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import SearchBar from "./search-bar";

import locale from "../locales/pt-BR";

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, .4)",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
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
  }

  static defaultProps = {
    isVisible: false,
  }

  componentDidUpdate(prevProps) {
    const { searchTitle } = this.props;
    const { input: searchBarInput } = this.searchBar && this.searchBar.state || {};

    if (this.props.isVisible !== prevProps.isVisible && this.searchBar) {
      if (this.props.isVisible === true) {
        setTimeout(() => this.searchBar.show(), 500);

        if (searchBarInput !== searchTitle) {
          this.searchBar.setValue(searchTitle);
        }
      }
    }
  }

  onSearch = () => {
    const {
      onSearch,
      onToggleModal,
    } = this.props;

    this.searchBar && onSearch(this.searchBar.getValue());
    onToggleModal();
  }

  render() {
    const {
      isVisible,
      onClearSearch,
      onSearch,
      onToggleModal,
    } = this.props;

    if (!isVisible) return null;

    return (
      <Animated.View style={[styles.container]}>
        <TouchableOpacity style={styles.background} onPress={onToggleModal} />
        <SearchBar
          ref={ref => this.searchBar = ref}
          onBack={onClearSearch}
          handleChangeText={onSearch}
          placeholder={locale.typeCityOrProjectLaw}
          phoneValidationCodeSent={"#828282"}
          backgroundColor={"#6000AA"}
          iconColor={"#6000AA"}
          fontSize={15}
          onSubmitEditing={this.onSearch} />
      </Animated.View>
    );
  }
}

export default SearchModal;
