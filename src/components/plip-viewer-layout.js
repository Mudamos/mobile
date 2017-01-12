import React, { Component, PropTypes }  from "react";

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import PageLoader from "./page-loader";
import PurpleFlatButton from "./purple-flat-button";
import SignModal from "./plip-signed-modal";
import MarkdownView from "../containers/markdown-view";
import BackButton from "./back-button";
import SignedMessageView from "./signed-message-view";

import styles from "../styles/plip-viewer-layout";

import textStyles from "../styles/text";

import locale from "../locales/pt-BR";


export default class PlipViewerLayout extends Component {
  state = {
    showSignSuccess: false,
  };

  static propTypes = {
    isSigning: PropTypes.bool,
    justSignedPlip: PropTypes.bool,
    plip: PropTypes.object, // Injected through navigation params
    userSignDate: PropTypes.object,
    onBack: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onSignSuccessClose: PropTypes.func.isRequired,
  };

  get plipName() {
    const { plip } = this.props;
    return plip.phase.name;
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
      isSigning,
    } = this.props;

    const { showSignSuccess } = this.state;

    return (
      <View style={[styles.container]}>
        <Layout>
          {this.renderNavBar()}
          {this.renderMainContent()}
        </Layout>

        {showSignSuccess && this.renderSignSuccess()}

        <PageLoader isVisible={isSigning} />
      </View>
    );
  }

  renderMainContent() {
    const {
      plip,
      userSignDate,
    } = this.props;

    return (
      <View style={styles.full}>
        {userSignDate && <SignedMessageView date={userSignDate} />}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <MarkdownView content={plip.content} />
        </ScrollView>

        {
          !userSignDate && plip &&
            <PurpleFlatButton
              title={plip.callToAction}
              onPress={this.onPlipSign.bind(this)}
              style={signButtonStyle}
              textStyle={{fontSize: 19, fontFamily: "lato"}}
            />
        }
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
      />
    );
  }

  renderSignSuccess() {
    return (
      <SignModal
        onClose={this.onModalSuccessClose.bind(this)}
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

  onPlipSign() {
    const { plip, onPlipSign } = this.props;
    onPlipSign(plip);
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
