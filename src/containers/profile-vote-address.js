import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

import ProfileVoteAddressLayout from "../components/profile-vote-address-layout";

import {
  fetchCities,
  fetchStates,
  navigate,
  openURL,
  saveVoteAddress,
} from "../actions";

import {
  findCities,
  findStates,
  getTseVoteAddress,
  isSavingProfile,
} from "../selectors";

const mapStateToProps = state => ({
  cities: findCities(state),
  isSaving: isSavingProfile(state),
  states: findStates(state),
  tseVoteAddress: getTseVoteAddress(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigate("plipsNav")),
  onFetchCities: () => dispatch(fetchCities()),
  onFetchStates: () => dispatch(fetchStates()),
  onOpenURL: url => dispatch(openURL(url)),
  onSave: ({ city, state }) => dispatch(saveVoteAddress({ city, state })),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const { onFetchCities, onFetchStates } = this.props;

      onFetchStates();
      onFetchCities();
    },
  })
);

export default enhance(ProfileVoteAddressLayout);
