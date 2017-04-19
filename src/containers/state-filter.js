import { connect } from "react-redux";

import {
  clearStates,
  navigateBack,
  changePlipsFilterState,
} from "../actions";

import {
  findStates,
} from "../selectors";

import StateFilterLayout from "../components/state-filter-layout";


const onBack = dispatch => {
  dispatch(navigateBack());
  dispatch(clearStates());
};

const mapStateToProps = state => ({
  states: findStates(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => onBack(dispatch),
  onSelect: ({ state }) => {
    dispatch(changePlipsFilterState({ state }))
    onBack(dispatch);
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(StateFilterLayout);
