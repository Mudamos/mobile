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
import Ionicon from "react-native-vector-icons/Ionicons";

import LinearGradient from "react-native-linear-gradient";

import Layout from "./layout";
import HeaderLogo from "./header-logo";
import NavigationBar from "./navigation-bar";
import NetworkImage from "./network-image";
import PageLoader from "./page-loader";
import RetryButton from "./retry-button";
import PurpleFlatButton from "./purple-flat-button";
import SignModal from "./plip-signed-modal";
import SignedMessageView from "./signed-message-view";
import SignerBubbleView from "./signer-bubble-view";

import styles, {
  HEADER_SCROLL_DISTANCE,
  SMALL_ANIM_OFFSET,
} from "../styles/plip-show";

import textStyles from "../styles/text";

import locale from "../locales/pt-BR";


class PlipLayout extends Component {
  state = {
    showSignSuccess: false,
  };

  static propTypes = {
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlip: PropTypes.bool.isRequired,
    isSigning: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    justSignedPlip: PropTypes.bool,
    openMenu: PropTypes.func.isRequired,
    plip: PropTypes.object,
    plipSignInfo: PropTypes.object,
    retryPlip: PropTypes.func.isRequired,
    signers: PropTypes.array,
    signersTotal: PropTypes.number,
    userSignDate: PropTypes.object,
    onOpenSigners: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onSignSuccessClose: PropTypes.func.isRequired,
    onViewPlip: PropTypes.func.isRequired,
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

    const start = moment();
    const end = moment(plip.cycle.finalDate);

    return Math.max(0, end.diff(start, "days"));
  }

  get signatureEnabled() {
    const daysLeft = this.daysLeft;
    return !!daysLeft;
  }

  get callToAction() {
    const { plip } = this.props;
    if (!plip) return;

    return (plip.callToAction || "").toUpperCase();
  }

  componentWillMount() {
    this.setState({
      scrollY: new Animated.Value(0),
    });
  }

  componentWillReceiveProps(nextProps) {
    // Handling the success modal after signing the plip. It should be just displayed once.
    if (nextProps.justSignedPlip && nextProps.justSignedPlip !== this.props.justSignedPlip) {
      this.setState({ showSignSuccess: true });
    } else if (nextProps.justSignedPlip === false && this.state.showSignSuccess) {
      // Handling the case the modal was displayed on another view and we need to dismiss it here
      this.setState({ showSignSuccess: false });
    }
  }

  render() {
    const {
      isFetchingPlip,
      isSigning,
      errorFetchingPlips,
    } = this.props;

    const { showSignSuccess } = this.state;

    return (
      <View style={[styles.container]}>
        <Layout>
          { errorFetchingPlips && this.renderRetry() }
          { !errorFetchingPlips && !isFetchingPlip && this.renderMainContent() }
          { this.renderNavBar() }
        </Layout>

        {showSignSuccess && this.renderSignSuccess()}

        <PageLoader isVisible={isFetchingPlip || isSigning} />
      </View>
    );
  }

  renderMainContent() {
    const {
      plip,
      signers,
      signersTotal,
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
              {userSignDate && <SignedMessageView date={userSignDate} />}

              {
                !userSignDate && plip && this.signatureEnabled &&
                  <PurpleFlatButton
                    title={this.callToAction}
                    onPress={this.onPlipSign.bind(this)}
                    style={{marginHorizontal: 20}}
                    textStyle={{fontSize: 19, fontFamily: "lato"}}
                  />
              }

              <View style={styles.remainingDaysContainer}>
                {!!this.daysLeft && this.renderDaysLeft()}
                {!this.daysLeft && <Text style={styles.remainingDays}>{locale.petitionEnded}</Text>}

                {this.renderSignaturesCount()}
              </View>
            </View>

            <View style={styles.full}>
              <View style={styles.signersFakeTop} />
              <View style={styles.signersFakeBottom} />

              {
                signers &&
                  <SignerBubbleView
                    users={signers}
                    total={signersTotal}
                    style={styles.signersBubble}
                    onPress={this.onOpenSigners.bind(this)}
                  />
              }
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
    const { plipSignInfo, onViewPlip, plip } = this.props;

    return (
      <LinearGradient
        start={[0.0, 0.1]}
        end={[0.5, 1.0]}
        locations={[0, 0.5]}
        style={styles.footerContainer}
        colors={["#9844ce", "#7E52D8"]}
      >
        <TouchableOpacity
          onPress={() => onViewPlip(plip)}
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
          onPress={this.onOpenDocument.bind(this)}
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
                    Registrada em: {plipSignInfo.updatedAt.format("DD/MM/YYYY [às] HH:mm:ss")}
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
        rightView={!errorFetchingPlips && !isFetchingPlip ? this.renderShareButton() : null}
      />
    );
  }

  renderShareButton() {
    const { plip, onShare } = this.props;

    return (
      <TouchableOpacity onPress={() => onShare(plip)}>
        <Ionicon
          name="md-share-alt"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    );
  }

  renderMenuButton() {
    const { openMenu } = this.props;

    return (
      <TouchableOpacity
        onPress={openMenu}
      >
        <Icon
          name="dehaze"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    );
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
          numberOfLines={1}
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

  renderSignSuccess() {
    const { plip, onShare } = this.props;

    return (
      <SignModal
        onClose={this.onModalSuccessClose.bind(this)}
        onShare={() => onShare(plip)}
      >
        <Text style={textStyles.modalTitle}>
          {locale.projectSignedYeah}
        </Text>

        <Text style={textStyles.modalText}>
          {
            `${locale.projectSignedCongratulations} "${this.plipName}"!`
          }
        </Text>
      </SignModal>
    );
  }

  onOpenDocument() {
    const { plip, onOpenURL } = this.props;
    onOpenURL(plip.documentUrl);
  }

  onPlipSign() {
    const { plip, onPlipSign } = this.props;
    onPlipSign(plip);
  }

  onModalSuccessClose() {
    const { onSignSuccessClose, plip } = this.props;

    this.setState({ showSignSuccess: false });
    onSignSuccessClose(plip);
  }

  onOpenSigners() {
    const { plip, onOpenSigners } = this.props;
    onOpenSigners(plip.id);
  }
}

export default PlipLayout
