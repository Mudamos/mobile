import React  from "react";

import {
  Button,
  Text,
  View
} from "react-native";

import { fetchPlip } from "../actions";

export default function PlipLayout({ plip = {}, dispatch }) {
  return (
    <View>
      <Text>Ola { plip.content }</Text>
      <Button
        onPress={() => { dispatch(fetchPlip())} }
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

//export default class App extends Component {
//  state = {};
//
//  constructor(...args) {
//    super(...args);
//
//    store.subscribe(() => {
//      const state = store.getState()
//      console.log('my store', state);
//      this.setState({ testing: state.plips.testing });
//    });
//  }
//
//  render() {
//    console.log(Config.MUDAMOS_API_URL);
//    console.log('render', this.state)
//    const { testing } = this.state;
//
//    return (
//      <View style={styles.container}>
//        <Text style={styles.welcome}>
//          Welcome to React Native! { testing }
//        </Text>
//        <Button
//          onPress={() => { store.dispatch({type: 'TEST'})} }
//          title="Learn More"
//          color="#841584"
//          accessibilityLabel="Learn more about this purple button"
//        />
//        <Text style={styles.instructions}>
//          To get started, edit index.android.js
//        </Text>
//        <Text style={styles.instructions}>
//          Double tap R on your keyboard to reload,{"\n"}
//          Shake or press menu button for dev menu
//        </Text>
//      </View>
//    );
//  }
//}
