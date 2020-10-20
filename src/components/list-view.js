import PropTypes from "prop-types";
import React, { Component } from "React";

import ListView from "deprecated-react-native-listview";


export default class MyListView extends Component {
  state = { isFirstRender: true };

  static propTypes = {
    ...ListView.propTypes,

    scrollTo: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      animated: PropTypes.bool,
    }),
  }

  static defaultProps = { ...ListView.defaultProps }

  render() {
    const { scrollTo, onLayout } = this.props;

    return (
      <ListView
        {...this.props}
        ref={ref => this.ref = ref}

        onLayout={(...args) => {
          if (onLayout) onLayout(...args);

          if (this.state.isFirstRender && scrollTo && this.ref) {
            this.ref.scrollTo(scrollTo);
            this.setState({ isFirstRender: false })
          }
        }}
      />
    );
  }
}
