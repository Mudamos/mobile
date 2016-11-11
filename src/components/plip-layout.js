import React, { PropTypes }  from "react";

import {
  Button,
  Text,
  View
} from "react-native";

export default function PlipLayout({ plip, retryPlip }) {
  return (
    <View>
      <Text>Ola { plip.content }</Text>
      <Button
        onPress={retryPlip}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

PlipLayout.propTypes = {
  plip: PropTypes.object.isRequired,
  retryPlip: PropTypes.func.isRequired
};

PlipLayout.defaultProps = {
  plip: {}
};
