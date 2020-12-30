import "./shim.js";

import { AppRegistry } from "react-native";
import App from "./src/app";
import SignerActionApp from "./src/app-action";
import { storeBuilder } from "./src/store";

const { store, run } = storeBuilder();
run();

AppRegistry.registerComponent("MudamosMobile", () => App(store));
AppRegistry.registerComponent("SignerAction", () => SignerActionApp(store));
