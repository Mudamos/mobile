import PropTypes from "prop-types";
import React, { Component } from "react";

import { ScrollView, TouchableOpacity, View } from "react-native";

import { withAfterPlipValidation } from "../decorators";

import { eligibleToSignPlip, moment } from "../utils";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import PageLoader from "./page-loader";
import PurpleFlatButton from "./purple-flat-button";
import SignModal from "./plip-signed-modal";
import MarkdownView from "../containers/markdown-view";
import BackButton from "./back-button";
import SignedMessageView from "./signed-message-view";
import ConfirmSignModal from "./confirm-sign-modal";
import SafeAreaView from "./safe-area-view";

import styles from "../styles/plip-viewer-layout";
import plipHtmlStyles from "../styles/plip-html-styles";

const callToActionTextStyle = { fontSize: 19, fontFamily: "lato" };

const enhance = withAfterPlipValidation;

class PlipViewerLayout extends Component {
  state = {
    showSignSuccess: false,
    isSignModalVisible: false,
  };

  static propTypes = {
    isSigning: PropTypes.bool,
    justSignedPlip: PropTypes.bool,
    plip: PropTypes.object,
    user: PropTypes.object,
    userSignDate: PropTypes.object,
    onBack: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onSignSuccessClose: PropTypes.func.isRequired,
  };

  get plipName() {
    const { plip } = this.props;
    return plip && plip.title;
  }

  get callToAction() {
    const { plip } = this.props;
    if (!plip) return;

    return (plip.callToAction || "").toUpperCase();
  }

  get daysLeft() {
    const { plip } = this.props;
    if (!plip) return;

    const start = moment();
    const end = moment(plip.finalDate);

    // No days left because there are no more seconds left
    if (end.diff(start, "seconds") < 0) return;

    return end.diff(start, "days");
  }

  get signatureEnabled() {
    const daysLeft = this.daysLeft;
    return daysLeft != null && daysLeft >= 0;
  }

  onPlipSign = () => {
    const { plip, onPlipSign } = this.props;
    this.onToggleSignModal();
    onPlipSign(plip);
  };

  onToggleSignModal = () => {
    this.setState(({ isSignModalVisible }) => ({
      isSignModalVisible: !isSignModalVisible,
    }));
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Handling the success modal after signing the plip. It should be just displayed once.
    if (
      nextProps.justSignedPlip &&
      nextProps.justSignedPlip !== this.props.justSignedPlip
    ) {
      this.setState({ showSignSuccess: true });
    } else if (
      nextProps.justSignedPlip === false &&
      this.state.showSignSuccess
    ) {
      // Handling the case the modal was displayed on another view and we need to dismiss it here
      this.setState({ showSignSuccess: false });
    }
  }

  render() {
    const { isSigning } = this.props;

    const { showSignSuccess, isSignModalVisible } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Layout style={styles.white}>
          {this.renderNavBar()}
          {this.renderMainContent()}
        </Layout>

        {showSignSuccess && this.renderSignSuccess()}

        <PageLoader isVisible={isSigning} />
        <ConfirmSignModal
          isVisible={isSignModalVisible}
          plipName={this.plipName}
          onToggleSignModal={this.onToggleSignModal}
          onPlipSign={this.onPlipSign}
        />
      </SafeAreaView>
    );
  }

  renderMainContent() {
    const { plip, userSignDate, user, onLogin } = this.props;

    const canSign = eligibleToSignPlip({ plip, user });
    const willSign = canSign && !userSignDate && this.signatureEnabled;
    const shouldLogin = !user && this.signatureEnabled;

    const onPress =
      (shouldLogin && onLogin) || (willSign && this.onToggleSignModal);

    return (
      <View style={styles.full}>
        {userSignDate && <SignedMessageView date={userSignDate} />}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <MarkdownView
            content={plip.content}
            contentContainerStyle={plipHtmlStyles}
          />
        </ScrollView>

        {!userSignDate && plip && this.signatureEnabled && (
          <PurpleFlatButton
            title={this.callToAction}
            onPress={onPress}
            style={signButtonStyle}
            textStyle={callToActionTextStyle}
          />
        )}
      </View>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;

    return (
      <NavigationBar
        containerStyle={styles.navigationBar}
        leftView={<BackButton onPress={onBack} />}
        title={this.plipName}
        rightView={this.renderShareButton()}
      />
    );
  }

  renderShareButton() {
    const { plip, onShare } = this.props;

    return (
      <TouchableOpacity onPress={() => onShare(plip)}>
        <Icon name="share" size={24} color="#fff" />
      </TouchableOpacity>
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

  onModalSuccessClose() {
    const { onSignSuccessClose, plip } = this.props;

    this.setState({ showSignSuccess: false });
    onSignSuccessClose(plip);
  }
}

const signButtonStyle = {
  marginHorizontal: 20,
  position: "absolute",
  top: -42 / 2,
  left: 0,
  right: 0,
  elevation: 5,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
};

export default enhance(PlipViewerLayout);
