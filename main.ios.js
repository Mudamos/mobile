import "./shim.js";

import { AppRegistry } from "react-native";
import App from "./src/app";
import { storeBuilder } from "./src/store";

const { store, run } = storeBuilder();
run();

AppRegistry.registerComponent("MudamosMobile", () => App(store));
