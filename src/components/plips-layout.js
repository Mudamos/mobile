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
  homeLinks,
  NATIONWIDE_SCOPE,
  STATEWIDE_SCOPE,
  CITYWIDE_SCOPE,
} from "../utils";

import Icon from "react-native-vector-icons/MaterialIcons";

import {
  Parallax,
  ScrollDriver,
} from "@shoutem/animation";

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import RetryButton from "./retry-button";
import HeaderLogo from "./header-logo";
import NetworkImage from "./network-image";
import LinearGradient from "react-native-linear-gradient";
import FlatButton from "./flat-button";
import Collapsable from "./collapsable";
import MyListView from "./list-view";
import Triangle from "./triangle";

import styles from "../styles/plips-layout";

import locale from "../locales/pt-BR";

const LINKS_KEY = "LINKS";


export default class PlipsLayout extends Component {
  driver = new ScrollDriver();
  state = {
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
    statewidePlipsDataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    onChangeScope: PropTypes.func.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onGoToMudamos: PropTypes.func.isRequired,
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
    } = nextProps;

    if (nextFilters.scope !== this.props.filters.scope) {
      if (nextFilters.scope === STATEWIDE_SCOPE && !nextFilters.state) {
        onSelectStateFilter();
      } else if (nextFilters.scope === CITYWIDE_SCOPE && !nextFilters.city) {
        onSelectCityFilter();
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

    const onScroll = event => this.nationwideScroll = event.nativeEvent.contentOffset;
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

    const onScroll = event => this.statewideScroll = event.nativeEvent.contentOffset;
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

    const onScroll = event => this.citywideScroll = event.nativeEvent.contentOffset;
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
    const hasNoListYet = error || isFetching || !hasRows;
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
      <View style={{flex: 1, backgroundColor: hasNoListYet ? "white" : "black" }}>
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
        {...this.driver.scrollViewProps}

        scrollTo={scrollTo}
        style={styles.listView}
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        onEndReached={onFetchPlipsNextPage}
        onEndReachedThreshold={300}
        dataSource={dataSource}
        renderRow={this.renderRow({ height: 333, margin: 0 })}
        onScroll={onScroll}
        scrollEventThrottle={1000}
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

  renderRow = ({ height, margin }) => ([plip, index], section, row, highlightRow) => {
    const { onGoToPlip, nationwidePlipsDataSource } = this.props;

    const shouldHideOverflow = index > 0 || nationwidePlipsDataSource.getRowCount() === 1;

    const isLink = plip.key === LINKS_KEY;
    const TouchableView = isLink ? View : TouchableOpacity;

    return (
      <View style={styles.rowContainer}>
        <TouchableView
          onPress={() => {
            highlightRow(section, row);
            onGoToPlip(plip);
          }}
          style={[styles.tableRow, {
            // We don't want to overflow the first row, so we can see the image
            // on ios during the bounce animation
            overflow: shouldHideOverflow ? "hidden" : "visible",

            height,
            margin,
          }]}
        >
          {isLink && this.renderRowLinks()}
          {!isLink && this.renderRowPlip({ plip, index, height, margin })}
        </TouchableView>
      </View>
    );
  }

  renderRowLinks() {
    const { mudamos, projectsReason } = homeLinks;
    const { onOpenURL } = this.props;

    return (
      <LinearGradient
        start={[0.0, 0.1]}
        end={[0.5, 1.0]}
        locations={[0, 0.5]}
        style={styles.footerContainer}
        colors={["#9844ce", "#7E52D8"]}
      >
        <TouchableOpacity
          onPress={() => onOpenURL(mudamos.link) }
          style={styles.full}
        >
          {this.renderLink({ ...mudamos, icon: "extension" })}
        </TouchableOpacity>

        <View style={styles.hairline} />

        <TouchableOpacity
          onPress={() => onOpenURL(projectsReason.link) }
          style={styles.full}
        >
          {this.renderLink({ ...projectsReason, icon: "info" })}
        </TouchableOpacity>

      </LinearGradient>
    );
  }

  renderLink({ title, icon }) {
    return (
      <View style={styles.actionRow}>
        <Icon
          name={icon}
          size={40}
          color="#fff"
          style={styles.actionIcon}
        />
        <Text style={styles.actionTitle}>{title.toUpperCase()}</Text>
        <Icon
          name="chevron-right"
          size={40}
          color="#fff"
        />
      </View>
    );
  }

  renderRowPlip({ plip, index, height, margin }) {
    const totalHeight = height + margin;
    const scrollRange = totalHeight * (index - 1);

    // For some reason, Android crashes and a transform is applied
    // TODO: upgrade react-native and test again
    const ParallaxView = Platform.OS == "ios" ? Parallax : View;

    return (
      <View style={styles.full}>
        <ParallaxView
          driver={this.driver}
          scrollSpeed={0.7}
          style={{alignItems: "center", justifyContent: "center"}}
          header={index == 0 /* If this is not informed, Shouten will use the incorrect initial transform */}
          extrapolation={{
            // We must "divide" the scroll range into each PLIP,
            // otherwise the accumulated error will cause layout break on long lists
            inputRange: [scrollRange, scrollRange + totalHeight],
          }}
        >
          <NetworkImage
            source={{uri: this.plipImage(plip)}}
            resizeMode="cover"
            style={styles.plipImage}
          />
        </ParallaxView>

        { /* This gradient improves the reading of the PLIP title and subtitle */ }
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 1)"]}
          locations={[0.5, 0.9, 1]}
          style={styles.plipImageGradient}
        />

        <View style={styles.plipTitleContainer}>
          <View style={styles.plipTitleInnerContainer}>
            <Text style={styles.plipTitle} numberOfLines={3}>
              {plip.phase.name}
            </Text>

            <Text style={styles.plipSubtitle} numberOfLines={3}>
              {plip.phase.description}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderNoPlips() {
    const { onGoToMudamos } = this.props;

    return (
      <View style={styles.noProjectsContainer}>
        <View style={styles.noProjectsInnerContainer}>
          <Image
            source={require("../images/plip-page.png")}
            style={styles.noProjectsIcon}
          />

          <View>
            <Text style={styles.noProjectsText}>{locale.noProjectsYet}</Text>
            <Text style={styles.noProjectsText}>{locale.followUpOnTheWeb}</Text>
            <TouchableOpacity onPress={onGoToMudamos}>
              <Text style={styles.link}>mudamos.org</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatButton
          title={locale.openSite.toUpperCase()}
          onPress={onGoToMudamos}
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
          color="rgba(255,255,255,0.3)"
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
  const opacity = selected ? 1 : 0.43;

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.tabItem, { color: `rgba(255, 255, 255, ${opacity})` }]}>
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
