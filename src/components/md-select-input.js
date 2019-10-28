import PropTypes from "prop-types";
import React, { forwardRef, PureComponent } from "react";
import { FlatList, Platform, TouchableOpacity, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import MDTextInput from "./md-text-input";

class MDSelectInput extends PureComponent {
  static propTypes = {
    ...MDTextInput.propTypes,
    data: PropTypes.array.isRequired,
    innerRef: PropTypes.object.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    renderSearchResult: PropTypes.func.isRequired,
    style: PropTypes.object,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onSelection: PropTypes.func,
  };

  state = {
    isSearchOn: false,
  };

  onSetSearchOn = () => this.setState({ isSearchOn: true });

  onSetSearchOff = () => this.setState({ isSearchOn: false });

  onChangeText = text => {
    const { onChangeText } = this.props;

    this.onSetSearchOn();
    onChangeText(text);
  };

  onFocus = () => {
    const { onFocus } = this.props;

    this.onSetSearchOn();

    if (onFocus) onFocus();
  };

  onBlur = () => {
    setTimeout(() => {
      const { onBlur } = this.props;

      this.onSetSearchOff();

      if (onBlur) onBlur();
    }, 500);
  };

  onSelection = item => () => {
    const { onSelection } = this.props;

    this.onSetSearchOff();

    if (onSelection) onSelection(item);
  };

  renderSearchResult = data => {
    const { renderSearchResult } = this.props;

    return (
      <TouchableOpacity
        onPress={this.onSelection(data.item)}
        style={styles.searchRow}
      >
        <View style={styles.resultRow}>
          {renderSearchResult(data)}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { data, innerRef, keyExtractor, style, ...props } = this.props;
    const { isSearchOn } = this.state;

    return (
      <View style={[{ zIndex: 1 }, style]}>
        <MDTextInput
          {...props}

          onChangeText={this.onChangeText}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={innerRef}
        />
        {isSearchOn && (
          <View style={styles.searchResultBox}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              style={styles.resultList}
              automaticallyAdjustContentInsets={false}
              scrollEventThrottle={500}
              keyExtractor={keyExtractor}
              data={data}
              renderItem={this.renderSearchResult}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  resultList: {
    flex: 1,
  },
  resultRow: {
    flex: 1,
    padding: 6,
    justifyContent: "center",
  },
  searchResultBox: {
    backgroundColor: "#FFF",
    height: 90,
    elevation: 6,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOffset: { height: 5 },
    shadowOpacity: 0.7,
    zIndex: 1,

    ...(Platform.OS === "ios" ? {
      bottom: -68,
      position: "absolute",
      left: 0,
      right: 0,
    } : { marginTop: -24 }),
  },
  searchRow: {
    height: 30,
    flex: 1,
  },
});

export default forwardRef((props, ref) => <MDSelectInput {...props} innerRef={ref} />);
