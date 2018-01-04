import "./shim.js"

import { AppRegistry } from "react-native";
import App from "./src/app";
import SignerActionApp from "./src/app-action";

AppRegistry.registerComponent("MudamosMobile", () => App);
AppRegistry.registerComponent("SignerAction", () => SignerActionApp);
