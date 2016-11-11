import React, { PropTypes }  from "react";

import {
  Button,
  Text,
  View
} from "react-native";

export default function PlipLayout({ plip, signPlip }) {
  return (
    <View>
      <Text>Ola { plip.content }</Text>
      <Button
        onPress={signPlip}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

PlipLayout.propTypes = {
  plip: PropTypes.object.isRequired,
};

PlipLayout.defaultProps = {
  plip: {}
};
