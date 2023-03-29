import Main from "./screens/MainComponent";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import {store} from "./redux/store";

export default function App() {
  return (
    <Provider store={store} >
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </Provider>
  );
}
