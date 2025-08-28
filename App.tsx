import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  setRootIsConnected,
  setRootIsReady,
} from "./libs/redux/reducers/root.slice";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { login } from "./libs/redux/reducers/login.slice";
import { RootState, store } from "./libs/redux/store";
import { ms } from "react-native-size-matters";
import { StatusBar } from "expo-status-bar";
import { JSONGet } from "./libs/requests";
import Register from "./pages/register";
import Constants from "expo-constants";
import { View } from "react-native";
import Login from "./pages/login";
import Admin from "./pages/admin";
import { useEffect } from "react";
import User from "./pages/user";
import {
  getLoginCredentials,
  getAuthProfile,
  refreshToken,
} from "./libs/credentials";

const Stack = createNativeStackNavigator();
function Navigation({ children, initialRouteName }: any) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        {children}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LoginRegisterPage() {
  return (
    <Navigation initialRouteName="login">
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{ headerShown: false }}
      />
    </Navigation>
  );
}

function AdminPages() {
  return (
    <Navigation initialRouteName="/">
      {Admin.map(({ name, component, options }, admx) => (
        <Stack.Screen
          key={admx}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Navigation>
  );
}

function UserPages() {
  return (
    <Navigation initialRouteName="/">
      {User.map(({ name, component, options }, usrx) => (
        <Stack.Screen
          key={usrx}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Navigation>
  );
}

function App() {
  const loginState = useSelector((state: RootState) => state.login);
  const rootState = useSelector((state: RootState) => state.root);
  const dispatch = useDispatch();

  async function load() {
    // Connection test
    try {
      const req = await JSONGet("auth/connection-test");
      // Connected with server
      if (req.message) {
        dispatch(setRootIsConnected(true));
      }
    } catch (error) {}

    // Login check
    const isLogin: any = getLoginCredentials();
    // Already signed-in
    if (isLogin) {
      // Check token
      const { access_token, role, data } = isLogin;
      try {
        const loginProfile = await getAuthProfile(access_token);
        // Token expired
        if (!loginProfile) {
          // Refresh token
          await refreshToken(data.tlp);
          // Recall this function
          return load();
        }

        // Set login state to true
        dispatch(login(role));
      } catch (error) {
        // Disconnected from server
        dispatch(setRootIsConnected(false));
      }
    }

    // Remove loading animation after 3 seconds
    setTimeout(() => dispatch(setRootIsReady(true)), 3000);
  }

  useEffect(() => {
    load();
  }, []);

  // Open loading animtion if app/root is not ready
  if (!rootState.isReady)
    return (
      <Spinner
        visible={!rootState.isReady}
        textContent="Mohon tunggu ..."
        textStyle={{ color: "#fff", fontSize: ms(15) }}
      />
    );

  // Not signed-in (default page is login page)
  let page: any = <LoginRegisterPage />;

  // Already signed-in
  if (loginState.isLogin) {
    // Admin page
    if (loginState.loginRole == "Admin") {
      page = <AdminPages />;
    }

    // User page
    if (loginState.loginRole == "User") {
      page = <UserPages />;
    }
  }

  return page;
}

export default function AppContainer() {
  return (
    <Provider store={store}>
      <View
        style={{
          flex: 1,
          paddingTop: Constants.statusBarHeight,
        }}
      >
        <StatusBar style="auto" />
        <App />
      </View>
    </Provider>
  );
}
