import React, { Component, PropTypes }  from "react";

import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  formatNumber,
  moment,
} from "../utils";

import Icon from "react-native-vector-icons/MaterialIcons";

import LinearGradient from "react-native-linear-gradient";

import Layout from "./layout";
import HeaderLogo from "./header-logo";
import NavigationBar from "./navigation-bar";
import NetworkImage from "./network-image";
import PageLoader from "./page-loader";
import RetryButton from "./retry-button";
import PurpleFlatButton from "./purple-flat-button";
import styles, {
  HEADER_SCROLL_DISTANCE,
  SMALL_ANIM_OFFSET,
} from "../styles/plip-show";

import locale from "../locales/pt-BR";


class PlipLayout extends Component {
  static propTypes = {
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlip: PropTypes.bool.isRequired,
    isSigning: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    navigationState: PropTypes.object.isRequired,
    openMenu: PropTypes.func.isRequired,
    plip: PropTypes.object,
    plipSignInfo: PropTypes.object,
    retryPlip: PropTypes.func.isRequired,
    userSignDate: PropTypes.object,
    onPlipSign: PropTypes.func.isRequired,
  };

  get plipName() {
    const { plip } = this.props;
    if (!plip) return;

    return plip.phase && plip.phase.name;
  }

  get plipSubtitle() {
    const { plip } = this.props;
    if (!plip) return;

    return plip.phase && plip.phase.description;
  }

  get plipImage() {
    const { plip } = this.props;
    return plip && plip.cycle && plip.cycle.pictures && plip.cycle.pictures.original;
  }

  get plipPresentation() {
    const { plip } = this.props;
    return plip && plip.presentation;
  }

  get daysLeft() {
    const { plip } = this.props;
    if (!plip) return;

    const start = moment(plip.cycle.initialDate);
    const end = moment(plip.cycle.finalDate);

    return end.diff(start, "days");
  }

  componentWillMount() {
    this.setState({
      scrollY: new Animated.Value(0),
    });
  }

  render() {
    const {
      isFetchingPlip,
      isSigning,
      errorFetchingPlips,
    } = this.props;


    return (
      <View style={[styles.container]}>
        <Layout>
          { errorFetchingPlips && this.renderRetry() }
          { !errorFetchingPlips && !isFetchingPlip && this.renderMainContent() }
          { this.renderNavBar() }
        </Layout>
        <PageLoader isVisible={isFetchingPlip || isSigning} />
      </View>
    );
  }

  renderMainContent() {
    const {
      plip,
      userSignDate,
    } = this.props;

    return (
      <View style={styles.mainContentContainer}>
        {this.renderBackgroundHeader()}

        <ScrollView
          style={styles.scrollView}
          bounces={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
          )}
        >
          {this.renderScrollViewHeader()}

          <View style={styles.scrollViewContent}>

            <View style={styles.infoContainer}>
              {
                userSignDate &&
                  <LinearGradient
                    colors={["#00DB5E", "#00A79E"]}
                    style={styles.signedMessageContainer}
                  >
                    <Text style={styles.projectSigned}>{locale.projectSigned}</Text>
                    <Text style={styles.userSignDate} numberOfLines={2}>{userSignDate.format("DD/MM/YYYY HH:mm")}</Text>
                  </LinearGradient>
              }

              {
                !userSignDate && plip &&
                  <PurpleFlatButton
                    title={plip.callToAction}
                    onPress={this.onPlipSign.bind(this)}
                    style={{marginHorizontal: 20}}
                    textStyle={{fontSize: 16}}
                  />
              }

              <View style={styles.remainingDaysContainer}>
                {!!this.daysLeft && this.renderDaysLeft()}
                {!this.daysLeft && <Text style={styles.remainingDays}>{locale.petitionEnded}</Text>}

                {this.renderSignaturesCount()}
              </View>
            </View>

            {this.renderPresentation()}
          </View>

          {this.renderFooterActions()}
        </ScrollView>
      </View>
    );
  }

  renderScrollViewHeader() {
    const titlesOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[styles.scrollViewHeaderContainer, {
          opacity: titlesOpacity,
        }]}
      >
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={styles.mainTitle}
        >
          {this.plipName}
        </Text>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={styles.subtitle}
        >
          {this.plipSubtitle}
        </Text>
      </Animated.View>
    );
  }

  renderBackgroundHeader() {
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -50],
      extrapolate: "clamp",
    });

    const titlesBackgroundColor = this.state.scrollY.interpolate({
      inputRange: [0, 100, HEADER_SCROLL_DISTANCE],
      outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, .7)", "rgba(0, 0, 0, 1)"],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.imageBackgroundContainer}>
        <NetworkImage
          source={{uri: this.plipImage}}
          style={[styles.backgroundImage, {
            transform: [{translateY: imageTranslate}],
          }]}
          resizeMode="cover"
        >
          <Animated.View
            style={[styles.full, {
              backgroundColor: titlesBackgroundColor,
            }]}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)", "rgba(0,0,0,1)"]}
              locations={[0.5, 0.7, 1]}
              style={styles.full}
            />
          </Animated.View>
        </NetworkImage>
      </View>
    );
  }

  renderSignaturesCount() {
    const { plip, plipSignInfo } = this.props;

    if (!plip || !plip.signaturesRequired) return null;

    const count = plipSignInfo && plipSignInfo.signaturesCount || 0;
    const total = plip.signaturesRequired || 0;
    return (
      <View style={styles.full}>
        <Text style={styles.signaturesCount}>{formatNumber(count)} de {formatNumber(total)}</Text>
        <Text style={styles.signatures}>{locale.signatures.toLowerCase()}</Text>
      </View>
    );
  }

  renderPresentation() {
    return (
      <View style={styles.presentationContainer}>
        <Text
          numberOfLines={0}
          style={styles.presentation}
        >
          {this.plipPresentation}
        </Text>
      </View>
    );
  }

  renderFooterActions() {
    const { plipSignInfo } = this.props;

    return (
      <LinearGradient
        start={[0.0, 0.1]}
        end={[0.5, 1.0]}
        locations={[0, 0.5]}
        style={styles.footerContainer}
        colors={["#9844ce", "#7E52D8"]}
      >
        <TouchableOpacity
          onPress={() => {}}
        >
          <View style={styles.actionRow}>
            <Icon
              name="insert-drive-file"
              size={40}
              color="#fff"
              style={styles.actionIcon}
            />
            <Text style={styles.actionTitle}>{locale.readFullText.toUpperCase()}</Text>
            <Icon
              name="chevron-right"
              size={40}
              color="#fff"
            />
          </View>
        </TouchableOpacity>

        <View style={styles.hairline} />

        <TouchableOpacity
          onPress={() => {}}
        >
          <View style={styles.actionRow}>
            <Icon
              name="file-download"
              size={40}
              color="#fff"
              style={styles.actionIcon}
            />
            <View style={styles.column}>
              <Text style={styles.actionTitle}>{locale.downloadPDF.toUpperCase()}</Text>
              {
                plipSignInfo && plipSignInfo.updatedAt &&
                  <Text style={styles.actionSubtitle}>
                    Atualizado em: {plipSignInfo.updatedAt.format("DD/MM/YYYY [às] HH:mm:ss")}
                  </Text>
              }
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  renderDaysLeft() {
    const message = this.daysLeft > 1 ? " dias restantes" : " dia restante";

    return (
      <View style={styles.full}>
        <Text style={styles.remainingDays}>{formatNumber(this.daysLeft)}{message}</Text>
        <Text style={styles.remainingDaysSubtitle}>para o encerramento</Text>
      </View>
    );
  }

  renderNavBar() {
    const {
      errorFetchingPlips,
      isFetchingPlip,
    } = this.props;

    const finalNavColor = "rgba(71, 57, 121, 1)";
    let navColorOpacity = this.state.scrollY.interpolate({
      inputRange: [0, (HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET) / 2, HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET],
      outputRange: ["rgba(71, 57, 121, 0)", "rgba(71, 57, 121, 0)", finalNavColor],
      extrapolate: "clamp",
    });

    if (errorFetchingPlips || isFetchingPlip) {
      // Forces nav bar color
      navColorOpacity = finalNavColor;
    }

    return (
      <NavigationBar
        containerStyle={[styles.navigationBar, {
          backgroundColor: navColorOpacity,
        }]}
        leftView={this.renderMenuButton()}
        middleView={this.renderLogo()}
      />
    );
  }

  renderMenuButton() {
    const { isUserLoggedIn, openMenu } = this.props;

    return isUserLoggedIn ? (
      <TouchableOpacity
        onPress={openMenu}
        style={styles.menuButton}
      >
        <Icon
          name="dehaze"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    ) : null;
  }

  renderLogo() {
    const inputRange = [
      0,
      (HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET) / 2,
      HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET,
    ];

    const logoOpacity = this.state.scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    const titleOpacity = this.state.scrollY.interpolate({
      inputRange,
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.logoContainer}>
        <HeaderLogo
          imgStyle={[styles.logo, {
            opacity: logoOpacity,
          }]}
        />
        <Animated.Text
          style={[styles.headerTitle, {
            opacity: titleOpacity,
          }]}
        >
          {this.plipName}
        </Animated.Text>
      </View>
    );
  }

  renderRetry() {
    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={this.props.retryPlip}
          backgroundColor="#ddd"
          style={{marginHorizontal: 20}}
        />
      </View>
    );
  }

  onPlipSign() {
    const { plip, onPlipSign } = this.props;
    onPlipSign(plip);
  }
}

export default PlipLayout
