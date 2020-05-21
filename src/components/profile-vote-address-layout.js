import PropTypes from "prop-types";
import { compose, curry, filter, lensPath, prop, propEq, set } from "ramda";
import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import BackButton from "./back-button";
import HeaderLogo from "./header-logo";
import Layout from "./purple-layout";
import NavigationBar from "./navigation-bar";
import PageLoader from"./page-loader";
import RoundedButton from "./rounded-button";
import SafeAreaView from "./safe-area-view";
import ScrollView from "./scroll-view";
import SignUpBreadCrumb from "./sign-up-breadcrumb";
import StaticFooter from "./static-footer";
import MDSelectInput from "./md-select-input";

import locale from "../locales/pt-BR";
import textStyles from "../styles/text";
import { filterDataByTerm } from "../utils";

import { cityRepository, stateRepository } from "../repositories";

// Improve performance using the imported json data instead of using redux.
// This won't change into an api anytime soon.
const cities = cityRepository.listSync();
const states = stateRepository.listSync();

const keyExtractor = compose(String, prop("id"));

const formatState = state => state && `${state.name} - ${state.uf}`;

const formatCity = city => city && city.name;

const byUf = curry((uf, collection) => filter(propEq("uf", uf))(collection));

const findCityForTse = ({ city, uf } = {}, collection) =>
  !city || !uf ? null : collection.find(item => item.name.toUpperCase() === city.toUpperCase() && item.uf.toUpperCase() === uf.toUpperCase());

const findStateForTse = ({ uf } = {}, collection) =>
  !uf ? null : collection.find(propEq("uf", uf.toUpperCase()));

class ProfileVoteAddressLayout extends PureComponent {
  static propTypes = {
    isSaving: PropTypes.bool,
    tseVoteAddress: PropTypes.shape({
      city: PropTypes.string,
      uf: PropTypes.string,
    }),
    onBack: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  cityInput = React.createRef();
  mainScrollView = React.createRef();
  ufInput = React.createRef();

  constructor(props) {
    super(props);

    const selectedCity = findCityForTse(props.tseVoteAddress || {}, cities);
    const selectedState = findStateForTse(props.tseVoteAddress || {}, states);
    const filteredCities = selectedState ? byUf(selectedState.uf, cities) : [];

    this.state = {
      citySearchTerm: "",
      errors: {},
      filteredCities,
      filteredStates: states,
      mainScrollViewOffset: null,
      selectedCity,
      selectedState,
      scopedCities: filteredCities,
      ufSearchTerm: "",
    };
  }

  onChangeUfSearch = ufSearchTerm => {
    this.setState({
      citySearchTerm: "",
      selectedCity: null,
      selectedState: null,
      ufSearchTerm,
      filteredStates: filterDataByTerm(ufSearchTerm, formatState, states),
      scopedCities: [],
      filteredCities: [],
    });
  };

  onChangeCitySearch = citySearchTerm => {
    this.setState(({ scopedCities }) => ({
      selectedCity: null,
      citySearchTerm,
      filteredCities: filterDataByTerm(citySearchTerm, formatCity, scopedCities),
    }));
  };

  onSetUf = selectedState => {
    const scopedCities = byUf(selectedState.uf, cities);

    this.setState({ citySearchTerm: "", selectedCity: null, selectedState, scopedCities, filteredCities: scopedCities });
    this.ufInput.current.blur();
  };

  onSetCity = selectedCity => {
    this.setState({ selectedCity });
    this.cityInput.current.blur();
  };

  onFocusField = () => {
    setTimeout(() => {
      const { mainScrollViewOffset } = this.state;

      if (mainScrollViewOffset) {
        this.mainScrollView.current.scrollTo({ x: 0, y: mainScrollViewOffset.y + 60 });
      }
    }, 100);
  };

  onMainScroll = ({ nativeEvent: { contentOffset }}) => this.setState({ mainScrollViewOffset: contentOffset });

  onUfSubmitEditing = () => {
    const { selectedState } = this.state;

    this.ufInput.current.blur();

    if (!selectedState) {
      this.setState({ ufSearchTerm: "", filteredStates: states });
    }
  };

  onCitySubmitEditing = () => {
    const { selectedCity } = this.state;

    this.cityInput.current.blur();

    if (!selectedCity) {
      this.setState(({ scopedCities }) => ({ citySearchTerm: "", filteredCities: scopedCities }));
    }
  };

  onSave = () => {
    const { onSave } = this.props;
    const { selectedCity, selectedState } = this.state;

    const setError = (field, message) => set(lensPath(["errors", field]), message);

    this.cityInput.current.blur();
    this.ufInput.current.blur();

    if (selectedState) {
      this.setState(state => setError("state", null)(state));
    } else {
      this.setState(state => setError("state", locale.pleaseSelectUf)(state));
      return;
    }

    if (selectedCity) {
      this.setState(state => setError("city", null)(state));
    } else {
      this.setState(state => setError("city", locale.pleaseSelectCity)(state));
      return;
    }

    this.setState({ errors: {} });

    onSave({ city: selectedCity, state: selectedState });
  };

  render() {
    const { isSaving, onOpenURL } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView ref={this.mainScrollView} onScroll={this.onMainScroll} scrollEventThrottle={16}>
            {this.renderNavBar()}

            <SignUpBreadCrumb highlightId={3} containerStyle={styles.breadcrumb} />

            {this.renderContent()}

            <StaticFooter onOpenURL={onOpenURL} />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </SafeAreaView>
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

  renderContent() {
    const { citySearchTerm, errors, filteredCities, filteredStates, selectedCity, selectedState, ufSearchTerm } = this.state;

    const selectedUf = formatState(selectedState);
    const selectedCityName = formatCity(selectedCity);

    return (
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            {locale.voteAddressTitle}
          </Text>

          <Text style={styles.headerSubTitle}>
            {locale.voteAddressSubtitle}
          </Text>
        </View>

        <View style={styles.paddedContainer}>
          <MDSelectInput
            data={filteredStates}
            keyExtractor={keyExtractor}
            renderSearchResult={this.renderUfSearchResult}
            style={{ zIndex: 2 }}
            onChangeText={this.onChangeUfSearch}
            onFocus={this.onFocusField}
            onSelection={this.onSetUf}
            placeholder={locale.stateWhereVote}
            value={selectedUf || ufSearchTerm}
            onSubmitEditing={this.onUfSubmitEditing}
            ref={this.ufInput}
            hasError={!!errors.state}
            error={errors.state}
          />

          <MDSelectInput
            data={filteredCities}
            keyExtractor={keyExtractor}
            renderSearchResult={this.renderCitySearchResult}
            onChangeText={this.onChangeCitySearch}
            onFocus={this.onFocusField}
            onSelection={this.onSetCity}
            placeholder={locale.cityWhereVote}
            value={selectedCityName || citySearchTerm}
            onSubmitEditing={this.onCitySubmitEditing}
            ref={this.cityInput}
            hasError={!!errors.city}
            error={errors.city}
          />
        </View>

        <View style={styles.buttonContainer}>
          <RoundedButton
            title={locale.continue}
            enabled={true}
            action={this.onSave}
            buttonStyle={styles.continueButton}
            titleStyle={styles.continueButtonTitle}
          />
        </View>
      </View>
    );
  }

  renderUfSearchResult = ({ item: state }) => {
    return (
      <Text style={styles.resultText}>{formatState(state)}</Text>
    );
  };

  renderCitySearchResult = ({ item: city }) => {
    return (
      <Text style={styles.resultText}>{formatCity(city)}</Text>
    );
  };
}

const styles = EStyleSheet.create({
  breadcrumb: {
    marginVertical: 15,
  },
  buttonContainer: {
    alignItems: "center",
    flex: 1,
    marginBottom: 20,
    marginTop: 60,
  },
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 12,
  },
  continueButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
  },
  continueButtonTitle: {
    color: "#FFF",
  },
  headerContainer: {
    marginHorizontal: 20,
  },
  headerSubTitle: {
    color: "#FFF",
    fontSize: "0.875rem",
    marginTop: 30,
    marginHorizontal: 10,
  },
  headerTitle: textStyles.header,
  paddedContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    zIndex: 1,
  },
  resultText: {
    color: "#000",
    fontFamily: "roboto",
    fontSize: "0.775rem",
    flex: 1,
  },
});

export default ProfileVoteAddressLayout;
