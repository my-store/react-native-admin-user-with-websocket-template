import { useDispatch, useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RootState } from "../../libs/redux/store";
import * as ImagePicker from "expo-image-picker";
import { ms } from "react-native-size-matters";
import {
  setRegisterPassword,
  setRegisterFoto,
  setRegisterNama,
  setRegisterWait,
  setRegisterTlp,
} from "../../libs/redux/reducers/register.slice";
import { FormPost } from "../../libs/requests";
import {
  ImageBackground,
  Dimensions,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Text,
  View,
} from "react-native";

const PreviewImageSize = Dimensions.get("window").width / 5;

export default function Register(props: any) {
  const registerState = useSelector((state: RootState) => state.register);
  const dispatch = useDispatch();

  function failed(msg: string) {
    Alert.alert("Gagal", msg);

    // Reset submit wait state
    setWait(false);
  }

  function setWait(state: boolean) {
    dispatch(setRegisterWait(state));
  }

  async function prepareRegister() {
    // Block if already submitted form
    if (registerState.registerWait) return;

    // Set wait after submit state
    setWait(true);

    // Get register data from state
    const { nama, tlp, password } = registerState;

    // Terminate if no nama is presented
    if (nama.length < 1) return failed("Mohon isi nama");

    // Terminate if no tlp is presented
    if (tlp.length < 1) return failed("Mohon isi no. Tlp");

    // Terminate if no password is presented
    if (password.length < 1) return failed("Mohon isi password");

    // Get image picked object
    const { foto } = registerState;

    // Terminate if no image is presented
    if (!foto) return failed("Silahkan pilih foto");

    // Set body data
    const body: any = { nama, tlp, password, foto };

    // Example RE-CHECK is user table still as admin child?
    // data.append("adminId", "1");

    let tryReg: any;
    try {
      tryReg = await FormPost("user/register", {
        headers: {
          // Example RE-CHECK is user table still as admin child?
          // Authorization: `Bearer ${}`
        },
        body,
      });

      // Error response from server
      if (tryReg.message) {
        return failed(tryReg.message);
      }
    } catch {
      // Failed to comunicate with server
      return failed("Gagal menambahkan data!");
    }

    // Reset form
    resetForm();
  }

  function resetForm() {
    // Reset nama
    dispatch(setRegisterNama(""));

    // Reset tlp
    dispatch(setRegisterTlp(""));

    // Reset password
    dispatch(setRegisterPassword(""));

    // Reset foto
    dispatch(setRegisterFoto(null));

    // Reset submit wait state
    setWait(false);
  }

  async function openGallery() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setRegisterFoto(result));
    }
  }

  return (
    <View style={Styles.Container}>
      <View style={Styles.HeaderContainer}>
        <Text style={Styles.HeaderText}>Register Page</Text>
      </View>

      <View style={Styles.FormGroupContainer}>
        <Text style={Styles.Label}>Nama</Text>
        <TextInput
          style={Styles.Input}
          onChangeText={(nama: string) => dispatch(setRegisterNama(nama))}
          defaultValue={registerState.nama}
        />
      </View>

      <View style={Styles.FormGroupContainer}>
        <Text style={Styles.Label}>No. Tlp</Text>
        <TextInput
          style={Styles.Input}
          onChangeText={(tlp: string) => dispatch(setRegisterTlp(tlp))}
          defaultValue={registerState.tlp}
        />
      </View>

      <View style={Styles.FormGroupContainer}>
        <Text style={Styles.Label}>Password</Text>
        <TextInput
          style={Styles.Input}
          onChangeText={(pass: string) => dispatch(setRegisterPassword(pass))}
          defaultValue={registerState.password}
        />
      </View>

      <Pressable onPress={openGallery}>
        <View
          style={[
            // Default styles
            Styles.ImagePreviewContainer,

            // Remove padding whenever image is set
            registerState.foto && { padding: 0 },
          ]}
        >
          {registerState.foto && (
            <ImageBackground
              source={{
                uri: registerState.foto.assets[0].uri,
              }}
              style={{
                width: ms(PreviewImageSize),
                height: ms(PreviewImageSize),
                borderRadius: ms(4),
              }}
            />
          )}
          {!registerState.foto && (
            <AntDesign name="user" size={ms(30)} color="black" />
          )}
          {!registerState.foto && (
            <Text style={Styles.ImagePreviewText}>Pilih Foto</Text>
          )}
        </View>
      </Pressable>

      <View style={[Styles.FormGroupContainer, Styles.FormButtonContainer]}>
        <Pressable style={Styles.ButtonContainer} onPress={prepareRegister}>
          <Text style={Styles.ButtonText}>Daftar</Text>
        </Pressable>
      </View>

      <View style={[Styles.FormGroupContainer, Styles.FormFooterContainer]}>
        <Text style={Styles.FooterText}>Sudah punya akun?</Text>
        <Text
          style={[Styles.FooterText, Styles.FooterLink]}
          onPress={() => props.navigation.goBack()}
        >
          Masuk
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

  ImagePreviewContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: ms(10),
    marginBottom: ms(5),
    backgroundColor: "#cecfcfff",
    padding: ms(10),
    borderRadius: ms(5),
    overflow: "hidden",
  },
  ImagePreviewText: {
    fontSize: ms(13),
    marginTop: ms(2),
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
