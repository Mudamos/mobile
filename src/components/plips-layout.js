import React, { Component, PropTypes } from "react";

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  ListView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import {
  moment,
  siteLinks,
  NATIONWIDE_SCOPE,
  STATEWIDE_SCOPE,
  CITYWIDE_SCOPE,
} from "../utils";

import Icon from "react-native-vector-icons/MaterialIcons";

import * as Animatable from "react-native-animatable";

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import RetryButton from "./retry-button";
import HeaderLogo from "./header-logo";
import NetworkImage from "./network-image";
import LinearGradient from "react-native-linear-gradient";
import FlatButton from "./flat-button";
import TransparentFlatButton from "./transparent-flat-button";
import Collapsable from "./collapsable";
import MyListView from "./list-view";
import Triangle from "./triangle";
import MetricsInfo from "./plip/metrics-info";

import styles from "../styles/plips-layout";

import locale from "../locales/pt-BR";


export default class PlipsLayout extends Component {
  state = {
    shouldFetchFirstTimeStatePlips: true,
    shouldFetchFirstTimeCityPlips: true,
    tabsArrowAnimation: new Animated.Value(0),
  };

  static propTypes = {
    citywidePlipsDataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    errorFetchingCitywidePlips: PropTypes.bool,
    errorFetchingNationwidePlips: PropTypes.bool,
    errorFetchingStatewidePlips: PropTypes.bool,
    filters: PropTypes.shape({
      scope: PropTypes.string.isRequired,
      state: PropTypes.shape({
        name: PropTypes.string.isRequired,
        uf: PropTypes.string.isRequired,
      }),
      city: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        uf: PropTypes.string.isRequired,
      }),
    }).isRequired,
    isFetchingCitywidePlips: PropTypes.bool,
    isFetchingNationwidePlips: PropTypes.bool,
    isFetchingStatewidePlips: PropTypes.bool,
    isRefreshingCitywide: PropTypes.bool,
    isRefreshingNationwide: PropTypes.bool,
    isRefreshingStatewide: PropTypes.bool,
    nationwidePlipsDataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    openMenu: PropTypes.func.isRequired,
    plipsSignInfo: PropTypes.object.isRequired,
    statewidePlipsDataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    userSignInfo: PropTypes.object.isRequired,
    onChangeScope: PropTypes.func.isRequired,
    onFetchPlips: PropTypes.func.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
    onSelectCityFilter: PropTypes.func.isRequired,
    onSelectStateFilter: PropTypes.func.isRequired,
  }

  get isNationwideFilter() {
    const { filters } = this.props;
    return filters.scope === NATIONWIDE_SCOPE;
  }

  get isStatewideFilter() {
    const { filters } = this.props;
    return filters.scope === STATEWIDE_SCOPE;
  }

  get isCitywideFilter() {
    const { filters } = this.props;
    return filters.scope === CITYWIDE_SCOPE;
  }

  componentDidMount() {
    const { filters } = this.props;

    this.animateTabsArrow({ toValue: this.tabsArrowPositionFor({ scope: filters.scope }) });
  }

  componentWillReceiveProps(nextProps) {
    const {
      filters: nextFilters,
      onSelectCityFilter,
      onSelectStateFilter,
      onFetchPlips,
      citywidePlipsDataSource,
      statewidePlipsDataSource,
    } = nextProps;

    const {
      shouldFetchFirstTimeCityPlips,
      shouldFetchFirstTimeStatePlips,
    } = this.state;

    if (nextFilters.scope !== this.props.filters.scope) {

      if (nextFilters.scope === STATEWIDE_SCOPE) {
        this.setState({ shouldFetchFirstTimeStatePlips: false });

        if (!nextFilters.state) {
          onSelectStateFilter();
        } else if (statewidePlipsDataSource.getRowCount() == 0 && shouldFetchFirstTimeStatePlips) {
          // If the filter was loaded say because of async storage
          // the state filter will be present but we would have no plips.
          // In this case we must fetch them.
          // We cannot only check if the rows are empty because we should not
          // fetch if the user is switching back to a filter which a fetch has already
          // been fired.
          onFetchPlips();
        }

      } else if (nextFilters.scope === CITYWIDE_SCOPE) {
        this.setState({ shouldFetchFirstTimeCityPlips: false });

        if (!nextFilters.city) {
          onSelectCityFilter();
        } else if (citywidePlipsDataSource.getRowCount() == 0 && shouldFetchFirstTimeCityPlips) {
          onFetchPlips();
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.full}>
        <Layout>
          {this.renderNavBar()}
          {this.renderTabs()}

          {this.renderNationwide()}
          {this.renderStatewide()}
          {this.renderCitywide()}
        </Layout>
      </View>
    );
  }

  renderNationwide() {
    const {
      errorFetchingNationwidePlips: error,
      isFetchingNationwidePlips: isFetching,
      isRefreshingNationwide: isRefreshing,
      nationwidePlipsDataSource: dataSource,
    } = this.props;

    if (!this.isNationwideFilter) return null;

    const onScroll = event => {
      this.nationwideScroll = event.nativeEvent.contentOffset;
    };

    const scrollTo = this.nationwideScroll;

    return this.renderScopeContent({
      error,
      isFetching,
      isRefreshing,
      dataSource,
      onScroll,
      scrollTo,
    });
  }

  renderStatewide() {
    const {
      errorFetchingStatewidePlips: error,
      isFetchingStatewidePlips: isFetching,
      isRefreshingStatewide: isRefreshing,
      statewidePlipsDataSource: dataSource,
    } = this.props;

    if (!this.isStatewideFilter) return null;

    const onScroll = event => {
      this.statewideScroll = event.nativeEvent.contentOffset;
    };
    const scrollTo = this.statewideScroll;

    return this.renderScopeContent({
      error,
      isFetching,
      isRefreshing,
      dataSource,
      onScroll,
      scrollTo,
    });
  }

  renderCitywide() {
    const {
      errorFetchingCitywidePlips: error,
      isFetchingCitywidePlips: isFetching,
      isRefreshingCitywide: isRefreshing,
      citywidePlipsDataSource: dataSource,
    } = this.props;

    if (!this.isCitywideFilter) return null;

    const onScroll = event => {
      this.citywideScroll = event.nativeEvent.contentOffset;
    };
    const scrollTo = this.citywideScroll;

    return this.renderScopeContent({
      error,
      isFetching,
      isRefreshing,
      dataSource,
      onScroll,
      scrollTo,
    });
  }

  renderScopeContent({ dataSource, error, isFetching, isRefreshing, onScroll, scrollTo }) {
    const { filters } = this.props;
    const hasRows = dataSource.getRowCount() > 0;
    const shouldShowNoPlips =
      !error &&
      !isFetching &&
      !hasRows &&
      (
        this.isNationwideFilter ||
        (this.isStatewideFilter && filters.state) ||
        (this.isCitywideFilter && filters.city)
      );


    return (
      <View style={{flex: 1, backgroundColor: "#F9F9F9" }}>
        {
          !error && hasRows &&
            this.renderListView({
              dataSource,
              isRefreshing,
              onScroll,
              scrollTo,
            })
        }

        {!!shouldShowNoPlips && this.renderNoPlips()}
        {error && this.renderRetry()}
        {isFetching && this.renderInnerLoader({ animating: isFetching })}
      </View>
    );
  }

  renderInnerLoader({ animating }) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator
          animating={animating}
          color="black"
          size="large"
        />
      </View>
    );
  }

  renderListView({ dataSource, isRefreshing, onScroll, scrollTo }) {
    const {
      onFetchPlipsNextPage,
      onRefresh,
    } = this.props;

    return (
      <MyListView
        scrollTo={scrollTo}
        style={styles.listView}
        contentContainerStyle={styles.listViewContent}
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        onEndReached={onFetchPlipsNextPage}
        onEndReachedThreshold={300}
        scrollEventThrottle={500}
        dataSource={dataSource}
        renderRow={this.renderRow({ height: 360, margin: 0 })}
        onScroll={onScroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
      />
    );
  }

  renderRow = ({ height, margin }) => ([plip], section, row, highlightRow) => {
    const { onGoToPlip } = this.props;

    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={() => {
            highlightRow(section, row);
            onGoToPlip(plip);
          }}
          style={[styles.tableRow, {
            minHeight: height,
            margin,
          }]}
        >
          {this.renderRowPlip({ plip, height, margin })}
        </TouchableOpacity>
      </View>
    );
  }

  renderRowPlip({ plip }) {
    const { plipsSignInfo, userSignInfo, onGoToPlip } = this.props;
    const plipSignInfo = plipsSignInfo[plip.id];
    const plipUserSignInfo = userSignInfo[plip.id];
    const hasSigned = !!(plipUserSignInfo && plipUserSignInfo.updatedAt);

    // Not every animation seem to work on both platforms
    const AnimatableView = Platform.OS === "ios" ? Animatable.View : View;

    return (
      <View style={styles.plipRow}>
        <NetworkImage
          source={{uri: this.plipImage(plip)}}
          resizeMode="cover"
          style={styles.plipImage}
        />

        { /* This gradient improves the reading of the PLIP title and subtitle */ }
        <LinearGradient
          colors={["rgba(0, 0, 0, .3)", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, .7)"]}
          locations={[0, 0.7, 1]}
          style={styles.plipImageGradient}
        />

        <View style={styles.plipTitleContainer}>
          <View style={styles.plipTitleInnerContainer}>
            <Text style={styles.plipTitle}>
              {plip.phase.name}
            </Text>

            <Text style={styles.plipSubtitle}>
              {plip.phase.description}
            </Text>
          </View>

          <TransparentFlatButton
            title={locale.moreDetails.toUpperCase()}
            onPress={() => onGoToPlip(plip)}
            style={{
              height: 30,
              marginHorizontal: 20,
              marginTop: 55,
              marginBottom: 25,
            }}
            textStyle={{
              textShadowColor: "rgba(0,0,0, 1)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
          />

          {
            !!plipSignInfo &&
              <Animatable.View animation="fadeInUp" easing="ease">
                <MetricsInfo
                  signaturesRequired={plip.signaturesRequired}
                  signaturesCount={plipSignInfo.signaturesCount}
                  finalDate={plip.phase.finalDate}
                />
              </Animatable.View>
          }

          {
            hasSigned &&
              <AnimatableView animation="zoomIn" easing="ease-in-out-sine" style={styles.signedContainer} duration={2000}>
                <LinearGradient
                  colors={["#00DB5E", "#00A79E"]}
                  style={styles.signedGradient}
                >
                  <Text style={styles.signedText}>{locale.signed}</Text>
                </LinearGradient>
              </AnimatableView>
          }

          <Image source={require("../images/plips-top-left.png")} style={{position: "absolute", top: 0, left: 0}} />
          <Image source={require("../images/plips-bottom-right.png")} style={{position: "absolute", bottom: 0, right: 0}} />
          <Image source={require("../images/plips-bottom-left.png")} style={{position: "absolute", bottom: 0, left: 0}} />
          <Image source={require("../images/plips-top-right.png")} style={{position: "absolute", top: 0, right: 0}} />
        </View>

      </View>
    );
  }

  renderNoPlips() {
    const { onOpenURL } = this.props;

    return (
      <View style={styles.noProjectsContainer}>
        <View style={styles.noProjectsInnerContainer}>
          <Image
            source={require("../images/plip-page.png")}
            style={styles.noProjectsIcon}
          />

          <Text style={styles.noProjectsText}>{locale.noProjectsYet}</Text>
        </View>

        <FlatButton
          title={locale.sendYourIdea.toUpperCase()}
          onPress={() => onOpenURL(siteLinks.sendYourIdea)}
          style={{backgroundColor: "#00c084" }}
          textStyle={{color: "#fff"}}
        />
      </View>
    );
  }

  renderTabs() {
    const { tabsArrowAnimation } = this.state;

    return (
      <View>
        <View style={styles.tabsContainer}>
          <TabItem
            title="NACIONAL"
            selected={this.isNationwideFilter}
            onPress={() => this.onChangeScope({ scope: NATIONWIDE_SCOPE })}
          />
          <TabItem
            title="ESTADUAL"
            selected={this.isStatewideFilter}
            onPress={() => this.onChangeScope({ scope: STATEWIDE_SCOPE })}
          />
          <TabItem
            title="MUNICIPAL"
            selected={this.isCitywideFilter}
            onPress={() => this.onChangeScope({ scope: CITYWIDE_SCOPE })}
          />

          <Triangle
            color="#883DE1"
            style={{
              transform: [{rotate: "180deg"}],
              position: "absolute",
              top: 0,
              left: tabsArrowAnimation,
            }}
          />
        </View>

        {this.renderSubTab()}
      </View>
    );
  }

  onChangeScope({ scope }) {
    this.animateTabsArrow({
      toValue: this.tabsArrowPositionFor({ scope }),
    });

    this.props.onChangeScope({ scope });
  }

  renderSubTab() {
    const {
      filters,
      onSelectCityFilter,
      onSelectStateFilter,
    } = this.props;

    return (
      <Collapsable collapsed={this.isNationwideFilter}>
        <View style={styles.subTabContainer}>
          {
            this.isStatewideFilter &&
              this.renderSubItem({
                onPress: onSelectStateFilter,
                title: filters.state ? filters.state.name.toUpperCase() : "Selecione um estado",
              })
          }

          {
            this.isCitywideFilter &&
              this.renderSubItem({
                onPress: onSelectCityFilter,
                title: filters.city ? `${filters.city.name.toUpperCase()}, ${filters.city.uf}` : "Selecione uma cidade",
              })
          }
        </View>
      </Collapsable>
    );
  }

  renderSubItem({ onPress, title }) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.subTabItemContainer}>
        <Text style={styles.subItem}>{title}</Text>

        <Icon
          name="arrow-drop-down"
          size={20}
          color="#8934E5"
        />
      </TouchableOpacity>
    );
  }

  animateTabsArrow({ toValue, duration = 200, easing = Easing.inOut(Easing.ease) }) {
    Animated.timing(
      this.state.tabsArrowAnimation,
      {
        toValue,
        duration,
        easing,
      }
    ).start();
  }

  tabsArrowPositionFor({ scope }) {
    const { width: windowWidth } = Dimensions.get("window");

    const windowPortion = [NATIONWIDE_SCOPE, STATEWIDE_SCOPE, CITYWIDE_SCOPE].indexOf(scope) + 1;
    const triangleWidth = 5;
    const windowSliceSize = windowWidth / 3;

    return ((windowSliceSize * windowPortion) - windowSliceSize / 2) - triangleWidth;
  }

  renderNavBar() {
    return (
      <NavigationBar
        containerStyle={styles.navigationBar}
        leftView={this.renderMenuButton()}
        middleView={this.renderLogo()}
      />
    );
  }

  renderLogo() {
    return <HeaderLogo />
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

  renderRetry() {
    const { onRetryPlips } = this.props;

    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={onRetryPlips}
          style={{marginHorizontal: 20, backgroundColor: "#ddd"}}
        />
      </View>
    );
  }

  formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  plipImage(plip) {
    return plip.cycle && plip.cycle.pictures && plip.cycle.pictures.original;
  }
}

const TabItem = ({ selected, title, onPress }) => {
  const color = selected ? "#8934E5"  : "#AAAAAA";

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.tabItem, { color }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

TabItem.propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
