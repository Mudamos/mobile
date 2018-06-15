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

import {
  isNationalCause,
} from "../models";

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

  onRetryAppLink = () => this.props.onRetryAppLink();

  onToggleSignModal() {
    const { isSignModalVisible } = this.state;

    this.setState({ isSignModalVisible: !isSignModalVisible });
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
        <ConfirmSignModal isVisible={isSignModalVisible} plipName={this.plipName} onToggleSignModal={this.onToggleSignModal.bind(this)} onPlipSign={this.onPlipSign.bind(this)}/>
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
                  onPress={this.onOpenSigners.bind(this)}
                />
            }
            <View style={{marginTop: 30, marginHorizontal: 15}}>
              {this.renderDescription()}
              <View style={[styles.divider, {marginVertical: 30, marginHorizontal: -15}]} />
              {this.renderPresentation()}
              {this.renderVideo()}
              {this.renderButtonReadFullText()}
              <View style={[styles.divider, {marginVertical: 30, marginHorizontal: -15}]} />
              <Text style={{fontWeight: "bold", color: "#000", marginBottom: 30}}>Informações Adicionais:</Text>
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

    const title = willSign && "Eu quero fazer a diferença" || willShare && "Faça a diferença e compartilhe";
    const onPress = willSign && this.onToggleSignModal.bind(this) || willShare && this.onShare.bind(this);
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

    return (
      <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
        <Text style={{color: "#000", paddingHorizontal: 10, paddingTop: 20}}>Assinaturas:{formatNumber(count)} Meta:{formatNumber(signatureGoals.finalGoal)}</Text>
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
        onPress={this.onViewPlip.bind(this)}
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
    const subtitle = plipSignInfo && plipSignInfo.updatedAt && "Registrada em: " + plipSignInfo.updatedAt.format("DD/MM/YYYY [às] HH:mm:ss");
    const action = this.onOpenDocument.bind(this);
    const icon = "file-download"
    const buttonStyle = { flexDirection: "row" }

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
    const subtitle = "Você será redirecionado para o site Mudamos+";
    const action = this.onOpenURL.bind(this);
    const icon = "exit-to-app";
    const buttonStyle = { flexDirection: "row" }
    return (
      <View style={{marginBottom: 20}}>
        <RoundedButton title={title} subtitle={subtitle} action={action} icon={icon} buttonStyle={buttonStyle}/>
      </View>
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

    const finalNavColor = "#7705B9";
    let navColorOpacity = this.state.scrollY.interpolate({
      inputRange: [0, (HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET) / 2, HEADER_SCROLL_DISTANCE - SMALL_ANIM_OFFSET],
      outputRange: ["#00000066", "#7705B9", finalNavColor],
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
      <TouchableOpacity onPress={this.onShare.bind(this)}>
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
          onPress={this.onFetchPlipRelatedInfo.bind(this)}
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

  onFetchPlipRelatedInfo() {
    const { plip, onFetchPlipRelatedInfo} = this.props;
    onFetchPlipRelatedInfo(plip.id);
  }

  onOpenDocument() {
    const { plip, onOpenURL } = this.props;
    onOpenURL(plip.documentUrl);
  }

  onPlipSign() {
    const { plip, onPlipSign } = this.props;
    this.onToggleSignModal();
    onPlipSign(plip);
  }

  onOpenSigners() {
    const { plip, onOpenSigners } = this.props;
    onOpenSigners(plip.id);
  }

  onOpenURL() {
    const { plip, onOpenURL } = this.props;
    onOpenURL(plip.plipUrl);
  }

  onShare() {
    const { plip, onShare } = this.props;
    onShare(plip);
  }

  onViewPlip() {
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
