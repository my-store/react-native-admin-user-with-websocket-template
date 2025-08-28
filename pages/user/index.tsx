import {
  setRootIsConnected,
  setRootIsReady,
} from "../../libs/redux/reducers/root.slice";
import { logout } from "../../libs/redux/reducers/login.slice";
import { useDispatch, useSelector } from "react-redux";
import { Button, StyleSheet, Text, View } from "react-native";
import { serverUrl } from "../../libs/requests";
import { Socket, io } from "socket.io-client";
import { useEffect } from "react";
import {
  removeLoginCredentials,
  getLoginCredentials,
  LoginCredentials,
} from "../../libs/credentials";
import { RootState } from "../../libs/redux/store";
import NotConnected from "../not-connected";

let socket: Socket;

interface UserPageInterface {
  name: string;
  component: any;
  options: any;
}

const UserPages: UserPageInterface[] = [
  {
    name: "/",
    component: User,
    options: {
      headerTitle: "Homepage",
    },
  },
];

function User() {
  const rootState = useSelector((state: RootState) => state.root);
  const dispatch = useDispatch();

  function socketListener() {
    socket = io(serverUrl);

    // Server is online (connected)
    socket.on("connect", () => {
      // Broadcast that i'am is online
      const user = getLoginCredentials();
      const { role, data }: LoginCredentials = user;
      socket.emit("online", { tlp: data.tlp, role });

      // Re-set connection status to true
      dispatch(setRootIsConnected(true));

      // Another tasks
    });

    // Server suddenly shutdown or changed configuration
    socket.on("disconnect", () => {
      // Change connected state to false
      dispatch(setRootIsConnected(false));
    });
  }

  function load() {
    socketListener();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={Styles.Container}>
      {
        // Socket disconnected
        !rootState.isConnected && <NotConnected />
      }
      <Text>User Homepage</Text>
      <Button
        title="Keluar"
        onPress={() => {
          // Terminate if disconnected from server
          if (!rootState.isConnected) return;

          // Open loading animation
          dispatch(setRootIsReady(false));

          // Broadcast offline event
          socket.emit("offline");

          // Remove login credentials
          removeLoginCredentials();

          // Set login state to false
          dispatch(logout());

          // Remove loading animation
          dispatch(setRootIsReady(true));
        }}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});

export default UserPages;
