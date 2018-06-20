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

import Layout from "./layout";
import HeaderLogo from "./header-logo";
import NavigationBar from "./navigation-bar";
import NetworkImage from "./network-image";
import PageLoader from "./page-loader";
import RetryButton from "./retry-button";
import BlueFlatButton from "./blue-flat-button";
import SignedMessageView from "./signed-message-view";
import SignerBubbleView from "./signer-bubble-view";
import BackButton from "./back-button";
import YouTube from "./you-tube";
import ProgressBarClassic from "./progress-bar-classic";
import RoundedButton from "./rounded-button";
import StaticFooter from "./static-footer";
import ConfirmSignModal from "./confirm-sign-modal";

import styles, {
  HEADER_SCROLL_DISTANCE,
  SMALL_ANIM_OFFSET,
} from "../styles/plip-show";

import locale from "../locales/pt-BR";

import {
  SignatureGoalsType,
} from "../prop-types";

export default class PlipLayout extends Component {
  state = {
    isSignModalVisible: false,
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
    onViewPlip: PropTypes.func.isRequired,
  };

  get plipName() {
    const { plip } = this.props;
    if (!plip) return;

    return plip.phase && plip.phase.name;
  }

  get plipImage() {
    const { plip } = this.props;
    return plip && plip.cycle && plip.cycle.pictures && plip.cycle.pictures.thumb;
  }

  get plipPresentation() {
    const { plip } = this.props;
    return plip && plip.presentation;
  }

  get plipDescription() {
    const { plip } = this.props;
    return plip && plip.phase && plip.phase.description;
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

  get callToAction() {
    const { plip } = this.props;
    if (!plip) return;

    return (plip.callToAction || "").toUpperCase();
  }

  get plipProgress() {
    const { plip, plipSignInfo, signatureGoals } = this.props;

    if (!plip || !signatureGoals.currentSignatureGoal) return 0;

    const count = plipSignInfo && plipSignInfo.signaturesCount || 0;
    const total = signatureGoals.finalGoal;
    const progress = clamp(0, 1, count / total);

    return progress;
  }

  get progressPercentage() {
    return Math.floor(this.plipProgress * 100);
  }

  onRetryAppLink = () => this.props.onRetryAppLink();

  onToggleSignModal = () => {
    const { isSignModalVisible } = this.state;

    this.setState(({ isSignModalVisible }) => ({ isSignModalVisible: !isSignModalVisible }));
  }

  componentWillMount() {
    this.setState({
      scrollY: new Animated.Value(0),
    });
  }

  render() {
    const {
      isFetchingPlipRelatedInfo,
      isSigning,
      errorFetching,
      errorHandlingAppLink,
      plip,
    } = this.props;

    const { isSignModalVisible } = this.state;

    return (
      <View style={[styles.container]}>
        <Layout>
          { errorHandlingAppLink && this.renderRetryAppLink() }
          { errorFetching && plip && this.renderRetry() }
          { !errorFetching && !errorHandlingAppLink && !isFetchingPlipRelatedInfo && plip && this.renderMainContent() }
          { this.renderNavBar() }
          { !errorFetching && !errorHandlingAppLink && !isFetchingPlipRelatedInfo && plip && this.renderSignButton() }
        </Layout>

        <PageLoader isVisible={isFetchingPlipRelatedInfo || isSigning || (!plip && !errorHandlingAppLink)} />
        <ConfirmSignModal isVisible={isSignModalVisible} plipName={this.plipName} onToggleSignModal={this.onToggleSignModal} onPlipSign={this.onPlipSign}/>
      </View>
    );
  }

  renderMainContent() {
    const {
      signers,
      signersTotal,
      onOpenURL,
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

            {userSignDate && <SignedMessageView date={userSignDate} />}
            {this.renderSignaturesCount()}

            {
              signers &&
                <SignerBubbleView
                  users={signers}
                  total={signersTotal}
                  style={styles.signersBubble}
                  onPress={this.onOpenSigners}
                />
            }
            <View style={styles.mainContainer}>
              {this.renderDescription()}
              <View style={styles.divider} />
              {this.renderPresentation()}
              {this.renderVideo()}
              {this.renderButtonReadFullText()}
              <View style={styles.divider} />
              <Text style={styles.aditionalInfo}>Informações Adicionais:</Text>
              {this.renderButtonDownloadPDF()}
              {this.renderButtonSignerList()}
            </View>
            <StaticFooter onOpenURL={onOpenURL} />
          </View>
        </ScrollView>
      </View>
    );
  }

  renderSignButton() {
    const {
      userSignDate,
    } = this.props;

    const willSign = !userSignDate && this.signatureEnabled;
    const willShare = userSignDate || !this.signatureEnabled;

    const title = willSign && locale.iWannaMakeTheDifference || willShare && locale.makeTheDifferenceAndShare;
    const onPress = willSign && this.onToggleSignModal || willShare && this.onShare;
    const iconName = willSign && "check-circle" || willShare && "share";

    return (
      <View style={styles.signButton}>
        <BlueFlatButton
          title={title}
          onPress={onPress}
          style={signButtonStyle}
          textStyle={{fontSize: 16, fontFamily: "lato"}}
          iconName={iconName}
        />
      </View>
    );
  }

  renderProgress() {
    return (
      <View style={{flex: 1, justifyContent: "center"}}>
        <ProgressBarClassic value={this.progressPercentage}/>
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
        <View style={styles.mainTitleContainer}>
          <Text
            style={styles.mainTitle}
          >
            {this.plipName}
          </Text>
          <View style={styles.mainTitleOptions}>
            {this.renderFavoriteButton()}
            {this.renderShareButton()}
          </View>
        </View>
      </Animated.View>
    );
  }

  renderBackgroundHeader() {
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -50],
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
        />
      </View>
    );
  }

  renderSignaturesCount() {
    const {
      plipSignInfo,
      signatureGoals,
    } = this.props;

    const count = plipSignInfo && plipSignInfo.signaturesCount || 0;

    const signaturesAndGoals = {
      signatures: formatNumber(count),
      goal: formatNumber(signatureGoals.finalGoal),
    }

    return (
      <View style={styles.signaturesAndGoalsContainer}>
        <Text style={styles.signaturesAndGoals}>{locale.signaturesAndGoals(signaturesAndGoals)}</Text>
      </View>
    );
  }

  renderDescription() {
    return (
      <View style={styles.textContainer}>
        <Text
          numberOfLines={0}
          style={styles.description}
        >
          {this.plipDescription}
        </Text>
      </View>
    );
  }

  renderPresentation() {
    return (
      <View style={styles.textContainer}>
        <Text
          numberOfLines={0}
          style={styles.presentation}
        >
          {this.plipPresentation}
        </Text>
      </View>
    );
  }

  renderButtonReadFullText() {
    return (
      <TouchableOpacity
        onPress={this.onViewPlip}
      >
        <View style={styles.actionFullText}>
          <Text style={styles.actionTitle}>{locale.readFullText.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderButtonDownloadPDF() {
    const {
      plipSignInfo,
    } = this.props;

    const title = locale.downloadPDF;
    const subtitle = plipSignInfo && plipSignInfo.updatedAt && locale.registeredAt + plipSignInfo.updatedAt.format("DD/MM/YYYY [às] HH:mm:ss");
    const action = this.onOpenDocument;
    const icon = "file-download";
    const buttonStyle = { flexDirection: "row" };

    return (
      <View style={{marginBottom: 20}}>
        <RoundedButton title={title} subtitle={subtitle} action={action} icon={icon} buttonStyle={buttonStyle}/>
      </View>
    );
  }

  renderButtonSignerList() {
    const {
      remoteConfig,
    } = this.props;

    const title = remoteConfig && remoteConfig.authenticatedSignersButtonTitle.toUpperCase();
    const subtitle = locale.youWillBeRedirectToMudamos;
    const action = this.onOpenURL;
    const icon = "exit-to-app";
    const buttonStyle = { flexDirection: "row" };

    return (
      <View style={{marginBottom: 20}}>
        <RoundedButton title={title} subtitle={subtitle} action={action} icon={icon} buttonStyle={buttonStyle}/>
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

    const finalNavColor = "#7705B9";
    let navColorOpacity = this.state.scrollY.interpolate({
      inputRange: [0, (HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET) / 2, HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET],
      outputRange: ["rgba(0,0,0,0.4)", "rgb(119, 5, 185)", finalNavColor],
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

  renderFavoriteButton() {
    return (
      <TouchableOpacity
      >
        <Icon
          name="favorite"
          style={styles.favoriteIcon}
          size={30}
          color="#00000080"
        />
      </TouchableOpacity>
    );
  }

  renderShareButton() {
    return (
      <TouchableOpacity onPress={this.onShare}>
        <Icon
          name="share"
          size={24}
          color="#00000080"
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
    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={this.onFetchPlipRelatedInfo}
          style={{marginHorizontal: 20, backgroundColor: "#ddd"}}
        />
      </View>
    );
  }

  renderRetryAppLink() {
    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={this.onRetryAppLink}
          style={{marginHorizontal: 20, backgroundColor: "#ddd"}}
        />
      </View>
    );
  }

  onFetchPlipRelatedInfo = () => {
    const { plip, onFetchPlipRelatedInfo} = this.props;
    onFetchPlipRelatedInfo(plip.id);
  }

  onOpenDocument = () => {
    const { plip, onOpenURL } = this.props;
    onOpenURL(plip.documentUrl);
  }

  onPlipSign = () => {
    const { plip, onPlipSign } = this.props;
    this.onToggleSignModal();
    onPlipSign(plip);
  }

  onOpenSigners = () => {
    const { plip, onOpenSigners } = this.props;
    onOpenSigners(plip.id);
  }

  onOpenURL = () => {
    const { plip, onOpenURL } = this.props;
    onOpenURL(plip.plipUrl);
  }

  onShare = () => {
    const { plip, onShare } = this.props;
    onShare(plip);
  }

  onViewPlip = () => {
    const { plip, onViewPlip } = this.props;
    onViewPlip(plip);
  }
}

const signButtonStyle = {
  backgroundColor: "#00BFD8",
  marginHorizontal: 20,
  marginVertical: 15,
  paddingHorizontal: 15,
  paddingVertical: 10,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
};
