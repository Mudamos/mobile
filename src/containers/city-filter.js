import { connect } from "react-redux";

import {
  clearCities,
  navigateBack,
  changePlipsFilterCity,
} from "../actions";

import {
  findCities,
} from "../selectors";

import CityFilterLayout from "../components/city-filter-layout";


const onBack = dispatch => {
  dispatch(navigateBack());
  dispatch(clearCities());
};

const mapStateToProps = state => ({
  cities: findCities(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => onBack(dispatch),
  onSelect: ({ city }) => {
    dispatch(changePlipsFilterCity({ city }))
    onBack(dispatch);
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(CityFilterLayout);
