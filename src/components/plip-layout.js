import React, { Component } from "react";

import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  formatNumber,
  moment,
} from "../utils";

import PropTypes from "prop-types";

import { clamp } from "ramda";

import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";

import LinearGradient from "react-native-linear-gradient";
import { MKProgress } from "react-native-material-kit";

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
import BackButton from "./back-button";
import YouTube from "./you-tube";

import {
  isNationalCause,
  isStateNationalCause,
  isUserGoals,
} from "../models";

import styles, {
  HEADER_SCROLL_DISTANCE,
  SMALL_ANIM_OFFSET,
} from "../styles/plip-show";

import locale from "../locales/pt-BR";

import {
  SignatureGoalsType,
} from "../prop-types";

const footerGradientStart = { x: 0.0, y: 0.1 };
const footerGradientEnd = { x: 0.5, y: 1.0 };
const footerGradientLocation = [0, 0.5];

export default class PlipLayout extends Component {
  state = {
    showSignSuccess: false,
  };

  static propTypes = {
    errorFetching: PropTypes.bool,
    errorHandlingAppLink: PropTypes.bool,
    isFetchingPlipRelatedInfo: PropTypes.bool,
    isRemainingDaysEnabled: PropTypes.bool,
    isSigning: PropTypes.bool,
    justSignedPlip: PropTypes.bool,
    plip: PropTypes.object,
    plipSignInfo: PropTypes.object,
    remoteConfig: PropTypes.shape({
      authenticatedSignersButtonTitle: PropTypes.string,
    }),
    signatureGoals: SignatureGoalsType,
    signers: PropTypes.array,
    signersTotal: PropTypes.number,
    user: PropTypes.object,
    userSignDate: PropTypes.object,
    onBack: PropTypes.func.isRequired,
    onFetchPlipRelatedInfo: PropTypes.func.isRequired,
    onOpenSigners: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onRetryAppLink: PropTypes.func.isRequired,
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
    return plip && plip.cycle && plip.cycle.pictures && plip.cycle.pictures.thumb;
  }

  get plipPresentation() {
    const { plip } = this.props;
    return plip && plip.presentation;
  }

  get daysLeft() {
    const { plip } = this.props;
    if (!plip) return;

    const start = moment();
    const end = moment(plip.phase.finalDate);

    // No days left because there are no more seconds left
    if (end.diff(start, "seconds") < 0) return;

    return end.diff(start, "days");
  }

  get signatureEnabled() {
    const daysLeft = this.daysLeft;
    return daysLeft != null && daysLeft >= 0;
  }

  get showCurrentGoal() {
    const { isRemainingDaysEnabled, plip } = this.props;
    return this.signatureEnabled && !isRemainingDaysEnabled && !isNationalCause(plip);
  }

  get messageForDaysLeft() {
    if (this.daysLeft > 0) {
      const sufix = this.daysLeft > 1 ? "dias" : "dia";
      return `${formatNumber(this.daysLeft)} ${sufix}`;
    } else if (this.daysLeft === 0) {
      return locale.lastDay;
    }
  }

  get callToAction() {
    const { plip } = this.props;
    if (!plip) return;

    return (plip.callToAction || "").toUpperCase();
  }

  get plipProgress() {
    const { plip, plipSignInfo, signatureGoals } = this.props;

    if (!plip || !signatureGoals.currentSignatureGoal) return 0;

    const count = plipSignInfo && plipSignInfo.signaturesCount || 0;
    const total = signatureGoals.currentSignatureGoal;
    const progress = clamp(0, 1, count / total);

    return progress;
  }

  get progressPercentage() {
    return Math.floor(this.plipProgress * 100);
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
      isFetchingPlipRelatedInfo,
      isSigning,
      errorFetching,
      errorHandlingAppLink,
      plip,
    } = this.props;

    const { showSignSuccess } = this.state;

    return (
      <View style={[styles.container]}>
        <Layout>
          { errorHandlingAppLink && this.renderRetryAppLink() }
          { errorFetching && plip && this.renderRetry() }
          { !errorFetching && !errorHandlingAppLink && !isFetchingPlipRelatedInfo && plip && this.renderMainContent() }
          { this.renderNavBar() }
        </Layout>

        {showSignSuccess && plip && this.renderSignSuccess()}

        <PageLoader isVisible={isFetchingPlipRelatedInfo || isSigning || (!plip && !errorHandlingAppLink)} />
      </View>
    );
  }

  renderMainContent() {
    const {
      isRemainingDaysEnabled,
      plip,
      signatureGoals,
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

            {this.renderProgress()}

            <View style={styles.infoContainer}>
              <View style={isNationalCause(plip) ? styles.infoNationalCauseContainerRow : styles.infoContainerRow}>
                {this.renderTargetPercentage(plip)}
                {this.renderSignaturesCount()}
                {this.signatureEnabled && isRemainingDaysEnabled && this.renderDaysLeft()}
                {!this.signatureEnabled && this.renderPlipFinished()}
              </View>

              { !!signatureGoals.finalGoal && !isNationalCause(plip) &&
                <Text style={styles.finalGoalText}>* Nossa meta final é de {formatNumber(signatureGoals.finalGoal)} assinaturas</Text>
              }
            </View>

            {userSignDate && <SignedMessageView date={userSignDate} />}
            {!userSignDate && plip && this.signatureEnabled && this.renderSignButton()}

            {
              signers &&
                <SignerBubbleView
                  users={signers}
                  total={signersTotal}
                  style={styles.signersBubble}
                  onPress={this.onOpenSigners.bind(this)}
                />
            }

            {this.renderPresentation()}
            {this.renderVideo()}
          </View>

          {this.renderFooterActions()}
        </ScrollView>
      </View>
    );
  }

  renderSignButton() {
    return (
      <View style={styles.full}>
        <View style={styles.infoFakeTop} />
        <View style={styles.infoFakeBottom} />

        <PurpleFlatButton
          title={this.callToAction}
          onPress={this.onPlipSign.bind(this)}
          style={signButtonStyle}
          textStyle={{fontSize: 19, fontFamily: "lato"}}
        />
      </View>
    );
  }

  renderProgress() {
    return (
      <MKProgress
        style={styles.progress}
        progressAniDuration={1000}
        progressColor="#00db5e"
        progress={this.plipProgress}
      />
    );
  }

  renderTargetPercentage(plip) {
    if (isNationalCause(plip)) return null;

    return (
      <View>
        <Text style={styles.infoPercentageText}>{this.progressPercentage}%</Text>
        <Text style={styles.infoPercentageSubtitle}>da meta atual *</Text>
      </View>
    );
  }

  renderPlipFinished() {
    return (
      <View>
        <View style={{flex: 1, justifyContent: "flex-end"}}>
          <Text style={styles.infoTextSubtitle}>{locale.petitionEnded}</Text>
        </View>
      </View>
    );
  }

  renderVideo() {
    const { plip } = this.props;
    if (!plip || !plip.videoId) return null;

    const { width } = Dimensions.get("window");
    const height = Math.floor(width * (360 /640));

    return (
      <YouTube
        videoId={plip.videoId}
        style={[styles.video, { height }]}
      />
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
              colors={["rgba(0, 0, 0, .4)", "rgba(0, 0, 0, .2)", "rgba(0, 0, 0, 0)"]}
              locations={[0, 0.3, 0.8]}
              style={styles.fullGradient}
            />

            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)", "rgba(0,0,0,.6)"]}
              locations={[0.5, 0.7, 1]}
              style={styles.fullGradient}
            />

            <LinearGradient
              colors={["rgba(0, 0, 0, .2)", "rgba(0, 0, 0, .2)"]}
              locations={[0, 1]}
              style={styles.fullGradient}
            />

          </Animated.View>
        </NetworkImage>
      </View>
    );
  }

  renderSignaturesCount() {
    const {
      plip,
      plipSignInfo,
      signatureGoals,
      user,
    } = this.props;

    const { currentSignatureGoal: goal } = signatureGoals;
    const count = plipSignInfo && plipSignInfo.signaturesCount || 0;

    const CountView = () =>
      <Text style={styles.infoText}>{formatNumber(count)}</Text>;

    const getMessage = () => {
      if (isUserGoals({ user, plip })) {
        const location = isStateNationalCause(plip)
          ? user.address.state
          : user.address.city;

          return `pessoas em ${location} assinaram`;
      }

      if (isNationalCause(plip)) {
        return "pessoas assinaram no Brasil";
      }

      return this.signatureEnabled ? "já assinaram" : "assinaram";
    }

    const signatureMessage = getMessage();

    return (
      <View style={{ flex: 1, marginLeft: 5 }}>
        {
          this.showCurrentGoal &&
            <View style={{ alignSelf: "flex-end", flexDirection: "row", alignItems: "flex-start"}}>
              <CountView />
              <Text style={[styles.infoTextSubtitle, { alignSelf: "center", marginLeft: 5 }]}>de</Text>
              <Text style={[styles.infoText, { marginLeft: 5 }]}>{formatNumber(goal)}</Text>
            </View>
        }

        {!this.showCurrentGoal && <CountView />}
        <Text style={[styles.infoTextSubtitle, this.showCurrentGoal ? { alignSelf: "flex-end" } : null]}>{signatureMessage}</Text>
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
    const {
      plipSignInfo,
      onViewPlip,
      plip,
      remoteConfig,
      onOpenURL,
    } = this.props;

    return (
      <LinearGradient
        start={footerGradientStart}
        end={footerGradientEnd}
        locations={footerGradientLocation}
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

        <View style={styles.hairline} />

        <TouchableOpacity
          onPress={() => onOpenURL(plip.plipUrl)}
        >
          <View style={styles.actionRow}>
            <Icon
              name="create"
              size={40}
              color="#fff"
              style={styles.actionIcon}
            />
            <Text style={styles.actionTitle}>{remoteConfig.authenticatedSignersButtonTitle.toUpperCase()}</Text>
            <Icon
              name="chevron-right"
              size={40}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  renderDaysLeft() {
    return (
      <View>
        <Text style={styles.infoText}>{this.messageForDaysLeft}</Text>
        <Text style={styles.infoTextSubtitle}>para o encerramento</Text>
      </View>
    );
  }

  renderNavBar() {
    const {
      errorFetching,
      errorHandlingAppLink,
      isFetchingPlipRelatedInfo,
      onBack,
    } = this.props;

    const finalNavColor = "rgba(71, 57, 121, 1)";
    let navColorOpacity = this.state.scrollY.interpolate({
      inputRange: [0, (HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET) / 2, HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET],
      outputRange: ["rgba(71, 57, 121, 0)", "rgba(71, 57, 121, 0)", finalNavColor],
      extrapolate: "clamp",
    });

    if (errorFetching || errorHandlingAppLink || isFetchingPlipRelatedInfo) {
      // Forces nav bar color
      navColorOpacity = finalNavColor;
    }

    return (
      <NavigationBar
        containerStyle={[styles.navigationBar, {
          backgroundColor: navColorOpacity,
        }]}
        leftView={<BackButton onPress={onBack} />}
        middleView={this.renderLogo()}
        rightView={!errorFetching && !errorHandlingAppLink && !isFetchingPlipRelatedInfo ? this.renderShareButton() : null}
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
          imgStyle={[{
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
    const { plip, onFetchPlipRelatedInfo } = this.props;
    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={() => onFetchPlipRelatedInfo(plip.id)}
          style={{marginHorizontal: 20, backgroundColor: "#ddd"}}
        />
      </View>
    );
  }

  renderRetryAppLink() {
    const { onRetryAppLink } = this.props;
    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={() => onRetryAppLink()}
          style={{marginHorizontal: 20, backgroundColor: "#ddd"}}
        />
      </View>
    );
  }

  renderSignSuccess() {
    const { plip, onShare } = this.props;

    return (
      <SignModal
        plipName={this.plipName}
        onShare={() => onShare(plip)}
        onClose={this.onModalSuccessClose.bind(this)}
      />
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

const signButtonStyle = {
  marginHorizontal: 20,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  elevation: 5,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
};
