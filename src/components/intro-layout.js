import PropTypes from "prop-types";
import React, { Component } from "react";

import { Image, Text, View } from "react-native";

import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";
import ChevronButton from "./chevron-button";
import Layout from "./purple-layout";
import RoundedButton from "./rounded-button";
import SplashLoader from "./splash-loader";
import SafeAreaView from "./safe-area-view";

import locale from "../locales/pt-BR";

import styles from "../styles/intro-layout";

import { isNotNil } from "../utils";

export default class IntroLayout extends Component {
  state = {
    loading: true,
    page: 0,
    tutorialDone: false,
  };

  static propTypes = {
    appLoadingProgress: PropTypes.number,
    isAppReady: PropTypes.bool,
    isUserFirstTime: PropTypes.bool,
    onHome: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    const { isUserFirstTime, onHome } = this.props;

    if (isNotNil(isUserFirstTime) && !isUserFirstTime) onHome();
  }

  get totalPages() {
    return 3;
  }

  get nextPage() {
    return this.state.page + 1;
  }

  get isLastPage() {
    return this.nextPage === this.totalPages;
  }

  get isFirstPage() {
    return this.state.page === 0;
  }

  goToNextPage = () => {
    if (this.isLastPage) return;

    this.setState(
      ({ page }) => ({ page: page + 1 }),
      () => this.pager.setPage(this.state.page),
    );
  };

  goToPreviousPage = () => {
    if (this.isFirstPage) return;

    this.setState(
      ({ page }) => ({ page: page - 1 }),
      () => this.pager.setPage(this.state.page),
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          {this.renderPager()}
          {this.renderButton()}
        </Layout>

        {this.renderFirstTimeLoader()}
      </SafeAreaView>
    );
  }

  renderPager() {
    return (
      <View style={styles.full}>
        <IndicatorViewPager
          ref={(pager) => (this.pager = pager)}
          style={styles.pager}
          indicator={this.renderIndicator()}
          onPageSelected={({ position }) => this.setState({ page: position })}>
          {this.renderStep0()}
          {this.renderStep1()}
          {this.renderStep2()}
        </IndicatorViewPager>
        <View style={[styles.chevronButtonContainer, styles.left]}>
          <ChevronButton
            size={40}
            style={styles.chevronButton}
            onPress={this.goToPreviousPage}
            direction="left"
            color={this.isFirstPage ? "transparent" : "#FFF"}
          />
        </View>
        <View style={[styles.chevronButtonContainer, styles.right]}>
          <ChevronButton
            size={40}
            style={styles.chevronButton}
            onPress={this.goToNextPage}
            direction="right"
            color={this.isLastPage ? "transparent" : "#FFF"}
          />
        </View>
      </View>
    );
  }

  renderIndicator() {
    return (
      <PagerDotIndicator
        dotStyle={styles.dot}
        selectedDotStyle={[styles.dot, styles.selectedDot]}
        pageCount={this.totalPages}
      />
    );
  }

  renderStep0() {
    return (
      <View style={styles.page}>
        <Text style={[styles.text, styles.title]}>
          {locale.firstTimeOpen.screen0.welcome}
        </Text>
        <Image source={require("../images/welcome.png")} />
        <Text style={[styles.text, styles.bold]}>
          {locale.firstTimeOpen.screen0.youAreAnMudamosAgent}
        </Text>
        <Text style={styles.text}>
          {locale.firstTimeOpen.screen0.aNewWayToMakeTheDifference}
        </Text>
      </View>
    );
  }

  renderStep1() {
    return (
      <View style={styles.page}>
        <Text style={[styles.text, styles.title]}>
          {locale.firstTimeOpen.screen1.sign}
        </Text>
        <Image source={require("../images/pencil.png")} />
        <Text style={[styles.text, styles.bold]}>
          {locale.firstTimeOpen.screen1.signIntro}
        </Text>
        <Text style={styles.text}>
          {locale.firstTimeOpen.screen1.voteCardInfoSecure}
        </Text>
      </View>
    );
  }

  renderStep2() {
    return (
      <View style={styles.page}>
        <Text style={[styles.text, styles.title]}>
          {locale.firstTimeOpen.screen2.share}
        </Text>
        <Image source={require("../images/share.png")} />
        <Text style={styles.text}>
          {locale.firstTimeOpen.screen2.youCanSharePls}
        </Text>
      </View>
    );
  }

  renderButton() {
    const { onHome } = this.props;

    const title = this.isLastPage ? locale.letsGo : locale.skip;

    return (
      <View style={styles.buttonContainer}>
        <RoundedButton
          title={title}
          action={onHome}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
    );
  }

  renderFirstTimeLoader() {
    const { isAppReady, appLoadingProgress } = this.props;
    return (
      <SplashLoader isVisible={!isAppReady} progress={appLoadingProgress} />
    );
  }
}
