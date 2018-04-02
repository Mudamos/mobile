import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Dimensions,
  Image,
  Text,
  View,
  WebView,
} from "react-native";

import Layout from "./purple-layout";
import NavigationBar from "./navigation-bar";
import BackButton from "./back-button";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import FlatButton from "./flat-button";

import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";

import styles from "../styles/tse-layout";

import locale from "../locales/pt-BR";


export default class TSELayout extends Component {
  state = {
    loading: true,
    page: 0,
    tutorialDone: false,
  }

  static propTypes = {
    onBack: PropTypes.func.isRequired,

    ...WebView.propTypes,
  }

  get totalPages() {
    return 5;
  }

  get nextPage() {
    return this.state.page + 1;
  }

  get isLastPage() {
    return this.nextPage === this.totalPages;
  }

  get loadingWebView() {
    const { loading, tutorialDone } = this.state;
    return loading && tutorialDone;
  }

  render() {
    const {
      tutorialDone,
    } = this.state;


    return (
      <View style={styles.container}>
        <Layout>
          {this.renderNavBar()}

          {tutorialDone ? this.renderWebView() : this.renderPager()}
        </Layout>

        <PageLoader isVisible={this.loadingWebView} />

      </View>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;
    return (
      <NavigationBar
        leftView={<BackButton onPress={onBack} />}
        middleView={<HeaderLogo />}
      />
    );
  }

  renderPager() {
    return (
      <View style={styles.full}>
        <IndicatorViewPager
          ref={pager => this.pager = pager}
          style={styles.pager}
          indicator={this.renderIndicator()}
          onPageSelected={({ position }) => this.setState({ page: position })}
        >

          {this.renderStep0()}
          {this.renderStep1()}
          {this.renderStep2()}
          {this.renderStep3()}
          {this.renderStep4()}

        </IndicatorViewPager>

        {this.renderTutorialControls()}
      </View>
    );
  }

  renderIndicator() {
    return <PagerDotIndicator pageCount={this.totalPages} />;
  }

  renderStep0() {
    return (
      <View style={[styles.page, styles.hPadded]}>
        <Text style={styles.tutorialText}>{locale.tseTutorial1}</Text>
        <Text style={styles.tutorialText}>{locale.tseTutorial2}</Text>
      </View>
    );
  }

  renderStep1() {
    const { width } = Dimensions.get("window");

    return (
      <View style={styles.page}>
        <View style={[styles.hPadded]}>
          <Text style={styles.tutorialText}>
            {locale.tseTutorial3} <Text style={[styles.tutorialText, styles.reference]}>{locale.voterName}</Text> e <Text style={[styles.tutorialText, styles.reference]}>{locale.voterBirthDay}</Text>.
          </Text>
        </View>

        <Image
          source={require("../images/TSE-name-birth-field.png")}
          resizeMode="contain"
          style={[styles.mediumVMargin, styles.full, { width, height: null }]}
        />

        <View style={[styles.hPadded]}>
          <Text style={styles.tutorialText}>{locale.tseTutorial4}</Text>
        </View>
      </View>
    );
  }

  renderStep2() {
    const { width } = Dimensions.get("window");

    return (
      <View style={[styles.page]}>
        <View style={[styles.hPadded]}>
          <Text style={styles.tutorialText}>{locale.tseTutorial5} <Text style={[styles.tutorialText, styles.reference]}>{locale.tseNotRobot}</Text>.</Text>
        </View>

        <Image
          source={require("../images/TSE-not-robot.png")}
          resizeMode="contain"
          style={[styles.mediumVMargin, styles.full, { width, height: null }]}
        />

        <View style={[styles.hPadded]}>
          <Text style={styles.tutorialText}>{locale.tseTutorial6}</Text>
        </View>
      </View>
    );
  }

  renderStep3() {
    const { width } = Dimensions.get("window");

    return (
      <View style={[styles.page]}>
        <View style={[styles.hPadded]}>
          <Text style={styles.tutorialText}>{locale.tseTutorial7}</Text>
        </View>

        <Image
          source={require("../images/TSE-questions.png")}
          resizeMode="contain"
          style={[styles.mediumVMargin, styles.full, { width, height: null }]}
        />
      </View>
    );
  }

  renderStep4() {
    const { width } = Dimensions.get("window");

    return (
      <View style={[styles.page]}>
        <View style={[styles.hPadded]}>
          <Text style={styles.tutorialText}>{locale.tseTutorial8} <Text style={[styles.tutorialText, styles.reference]}>{locale.tseSubmit}</Text>.</Text>
        </View>

        <Image
          source={require("../images/TSE-done.png")}
          resizeMode="contain"
          style={[styles.smallVMargin, styles.full, { width, height: null }]}
        />

        <View style={[styles.hPadded]}>
          <Text style={styles.tutorialText}>{locale.tseTutorial9}</Text>
        </View>
      </View>
    );
  }

  renderTutorialControls() {
    const commonBtnStyle = { borderRadius: 0, flex: 1 };
    return (
      <View style={styles.controlsContainer}>
        <FlatButton
          title={locale.skip.toUpperCase()}
          enabled={!this.isLastPage}
          style={{ ...commonBtnStyle }}
          onPress={() => this.setState({ tutorialDone: true })}
        />

        {
          this.isLastPage ?
            <FlatButton
              title={locale.okIGotIt.toUpperCase()}
              style={{ ...commonBtnStyle, backgroundColor: "#595959"}}
              textStyle={{color: "#fff"}}
              onPress={() => this.setState({ tutorialDone: true })}
            />
            :
            <FlatButton
              title={locale.next.toUpperCase()}
              style={{ ...commonBtnStyle, backgroundColor: "#595959"}}
              textStyle={{color: "#fff"}}
              onPress={() => this.pager.setPage(this.nextPage)}
            />
        }
      </View>
    );
  }

  renderWebView() {
    const {
      ...webViewProps
    } = this.props;

    return (
      <WebView
        {...webViewProps}
        onLoadEnd={this.onLoadEnd.bind(this)}
      />
    );
  }

  onLoadEnd() {
    const { onLoadEnd } = this.props;

    this.setState({ loading: false });

    onLoadEnd && onLoadEnd();
  }
}
