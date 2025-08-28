import { setRootIsReady } from "../../libs/redux/reducers/root.slice";
import {
  setLoginPass,
  setLoginWait,
  setLoginTlp,
  login,
} from "../../libs/redux/reducers/login.slice";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../libs/credentials";
import { RootState } from "../../libs/redux/store";
import { JSONPost } from "../../libs/requests";
import { ms } from "react-native-size-matters";
import * as Store from "expo-secure-store";
import { useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Text,
  View,
} from "react-native";

export default function Login(props: any) {
  const loginState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  async function load() {}

  function failed(msg: string) {
    Alert.alert("Gagal", msg);

    // Remove loading animation
    dispatch(setRootIsReady(true));

    // Reset submit wait state
    dispatch(setLoginWait(false));
  }

  async function prepareLogin() {
    // Block if already submitted form
    if (loginState.loginWait) return;

    // Set wait after submit state
    dispatch(setLoginWait(true));

    const {
      prepareLoginData: { tlp, pass },
    } = loginState;

    if (tlp.length < 1) return failed("Mohon isi no. Tlp");
    if (pass.length < 1) return failed("Mohon isi password");

    // Open loading animation
    dispatch(setRootIsReady(false));

    const tryLogin = await JSONPost("auth", {
      body: JSON.stringify({ tlp, pass }),
    });
    if (tryLogin.message) {
      return failed("Kombinasi data salah!");
    }

    const userData = await getUserData(tlp, tryLogin);
    if (!userData) {
      return failed("Gagal mengambil data!");
    }

    // Save login data
    Store.setItem(
      "login.credentials",
      JSON.stringify({ ...tryLogin, data: userData })
    );

    // Set login state to true
    dispatch(login(tryLogin.role));

    // Reset submit wait state
    dispatch(setLoginWait(false));

    // Remove loading animation
    dispatch(setRootIsReady(true));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={Styles.Container}>
      <View style={Styles.HeaderContainer}>
        <Text style={Styles.HeaderText}>Login Page</Text>
      </View>

      <View style={Styles.FormGroupContainer}>
        <Text style={Styles.Label}>No. Tlp</Text>
        <TextInput
          style={Styles.Input}
          onChangeText={(tlp: string) => dispatch(setLoginTlp(tlp))}
        />
      </View>

      <View style={Styles.FormGroupContainer}>
        <Text style={Styles.Label}>Password</Text>
        <TextInput
          style={Styles.Input}
          onChangeText={(pass: string) => dispatch(setLoginPass(pass))}
        />
      </View>

      <View style={[Styles.FormGroupContainer, Styles.FormButtonContainer]}>
        <Pressable style={Styles.ButtonContainer} onPress={prepareLogin}>
          <Text style={Styles.ButtonText}>Masuk</Text>
        </Pressable>
      </View>

      <View style={[Styles.FormGroupContainer, Styles.FormFooterContainer]}>
        <Text style={Styles.FooterText}>Belum punya akun?</Text>
        <Text
          style={[Styles.FooterText, Styles.FooterLink]}
          onPress={() => props.navigation.navigate("register")}
        >
          Daftar
        </Text>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  Container: {
    flex: 1,
  },

  HeaderContainer: {},
  HeaderText: {
    alignSelf: "center",
    fontWeight: 500,
    fontSize: ms(23),
  },

  FormGroupContainer: {
    paddingHorizontal: ms(10),
    marginTop: ms(10),
  },
  Label: {
    fontSize: ms(14),
    lineHeight: ms(17),
    backgroundColor: "#fff",
    borderWidth: ms(1),
    borderRadius: ms(8.5),
    alignSelf: "flex-start",
    paddingHorizontal: ms(15),
    position: "relative",
    zIndex: 1,
    transform: [{ translateY: ms(8.5) }, { translateX: ms(20) }],
  },
  Input: {
    backgroundColor: "#fff",
    height: ms(40),
    borderWidth: ms(1),
    borderRadius: ms(20),
  },

  FormFooterContainer: {
    flexDirection: "row",

    // Override the FormGroupContainer style
    marginTop: ms(0),
  },
  FooterText: {
    fontSize: ms(14),
  },
  FooterLink: {
    color: "blue",
    marginLeft: ms(5),
  },

  FormButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  ButtonContainer: {
    backgroundColor: "#3aabc7ff",
    marginLeft: ms(5),
    paddingHorizontal: ms(23),
    borderRadius: ms(20),
  },
  ButtonText: {
    color: "#fff",
    fontWeight: 500,
    fontSize: ms(14),
    lineHeight: ms(40),
  },
});
