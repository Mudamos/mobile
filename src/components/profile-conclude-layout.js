import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Text,
  View,
} from "react-native";

import styles from "../styles/profile-conclude-layout";

import BackButton from "./back-button";
import HeaderLogo from "./header-logo";
import Layout from "./purple-layout";
import NavigationBar from "./navigation-bar";
import PageLoader from "./page-loader";
import RoundedButton from "./rounded-button";
import ScrollView from "./scroll-view";
import SignUpBreadCrumb from "./sign-up-breadcrumb";
import StaticFooter from "./static-footer";
import { Plip } from "./plips-list";

import locale from "../locales/pt-BR";

export default class ProfileConcludeLayout extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    isSaving: PropTypes.bool,
    plip: PropTypes.object,
    plipsSignInfo: PropTypes.object,
    userSignInfo: PropTypes.object,
    onBack: PropTypes.func.isRequired,
    onConcludeSignUp: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func,
    onOpenURL: PropTypes.func.isRequired,
    onShare: PropTypes.func,
  }

  componentDidMount() {
    const { onConcludeSignUp } = this.props;

    onConcludeSignUp();
  }

  render() {
    const {
      isSaving,
      onBack,
      onOpenURL,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView style={styles.container}>
            {this.renderNavBar()}

            <SignUpBreadCrumb highlightId={4} containerStyle={styles.breadcrumb} />

            {this.renderContent()}

            <RoundedButton title={locale.seeAllProjects} action={onBack} buttonStyle={styles.blueRoundedButton} titleStyle={styles.blueRoundedButtonTitle}/>

            <StaticFooter onOpenURL={onOpenURL} />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
    );
  }

  renderContent() {
    const {
      currentUser,
      userSignInfo,
      plip,
      plipsSignInfo,
    } = this.props;

    const plipSignInfo = plipsSignInfo && plip && plipsSignInfo[plip.id];
    const plipUserSignInfo = userSignInfo && plip && userSignInfo[plip.id];
    const hasSigned = !!(plipUserSignInfo && plipUserSignInfo.updatedAt);
    const cover = plip && plip.cycle && plip.cycle.pictures && plip.cycle.pictures.thumb;

    const onGoToPlip = plip => {
      const { onGoToPlip } = this.props;
      onGoToPlip(plip);
    }

    const onShare = plip => {
      const { onShare } = this.props;
      onShare(plip);
    }

    return (
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            {locale.concludeHeaderTitle}
          </Text>
          <Text style={styles.headerSubTitle}>
            {locale.concludeHeaderSubtitle}
          </Text>
        </View>

        <View style={styles.plipContainer}>
          { plip &&
            <Plip
              user={currentUser}
              index={0}
              plip={plip}
              cover={cover}
              signaturesCount={plipSignInfo && plipSignInfo.signaturesCount}
              hasSigned={hasSigned}
              onShare={onShare}
              onGoToPlip={onGoToPlip}

              height={30}
              margin={0}
            />
          }
        </View>
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
}