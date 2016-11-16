import React, { PropTypes }  from "react";

import {
  Button,
  Image,
  Text,
  View
} from "react-native";

import ParallaxScrollView from 'react-native-parallax-scroll-view';

import Layout from "./layout";
import style, { parallaxScrollView } from "../styles/plip-show";

export default function PlipLayout({ plip, retryPlip }) {
  return (
    <View style={style.container}>
      <Layout>
        <ParallaxScrollView
          style={style.scrollView.style}
          {...parallaxScrollView}
          backgroundSpeed={10}

          renderBackground={() => (
            <Image source={{ uri: "https://i.ytimg.com/vi/P-NZei5ANaQ/maxresdefault.jpg" }} style={style.imageCall}/>
          )}
          renderForeground={() => (
            <View style={style.foreGroundContainer}>
              <View style={style.parallaxNav}>
                <Text>Voltar</Text>
              </View>
              <View style={style.mainTitleContainer}>
                <Text style={style.mainCycleTitle}>
                  Um título muito grande para quebra de linha que vai acontecer
                </Text>
              </View>
            </View>
          )}
          renderStickyHeader={() => (
            <View style={style.stickyHeader}>
              <Text style={style.navCycleTitle} numberOfLines={1}>Um título</Text>
            </View>
          )}
          >
          <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 30 }}>This is body context</Text></View>
        </ParallaxScrollView>
      </Layout>
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
