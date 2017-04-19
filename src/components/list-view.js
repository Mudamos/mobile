import React, { Component, PropTypes } from "React";

import { ListView } from "react-native";


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
    const { scrollTo } = this.props;

    return (
      <ListView
        {...this.props}
        ref={ref => this.ref = ref}

        onLayout={() => {
          if (this.state.isFirstRender && scrollTo && this.ref) {
            this.ref.scrollTo(scrollTo);
            this.setState({ isFirstRender: false })
          }
        }}
      />
    );
  }
}
