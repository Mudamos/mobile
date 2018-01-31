import { always } from "ramda";

const Signer = () => ({
  data: () => Promise.resolve(),
  close: () => {},
  done: () => {},
  isMainApp: always(true),
  isSignerApp: always(false),
});

export default Signer;
