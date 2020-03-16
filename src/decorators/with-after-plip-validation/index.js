import { lifecycle } from "recompose";

export const withAfterPlipValidation = lifecycle({
  onAfterMobileValidation() {
    const { plip, onPlipSign } = this.props;

    onPlipSign(plip);
  },

  componentDidUpdate(prevProps) {
    const { isMobileValidated } = this.props;

    if (isMobileValidated && !prevProps.isMobileValidated) {
      this.onAfterMobileValidation();
    }
  },
});
