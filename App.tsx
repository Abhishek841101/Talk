// import React from "react";
// import { Provider } from "react-redux";
// import { store } from "./src/app/store";
// import { NavigationContainer } from "@react-navigation/native";
// import AppNavigator from "./src/navigation/AppNavigator";

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <AppNavigator />
//       </NavigationContainer>
//     </Provider>
//   );
// }


// import React from "react";
// import { Provider } from "react-redux";
// import { store } from "./src/app/store";
// import { NavigationContainer } from "@react-navigation/native";
// import AppNavigation from "./src/navigation/AppNavigator";

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <AppNavigation />
//       </NavigationContainer>
//     </Provider>
//   );
// }




// App.js
import * as React from "react";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigation";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}
