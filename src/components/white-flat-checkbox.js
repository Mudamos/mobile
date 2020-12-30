import Checkbox from "./flat-checkbox";

export default class MyCheckbox extends Checkbox {
  static defaultProps = {
    ...Checkbox.defaultProps,

    fillColor: "#fff",
    borderOnColor: "#fff",
    borderOffColor: "#fff",
    rippleColor: "rgba(255,255,255,0.2)",
  };
}
