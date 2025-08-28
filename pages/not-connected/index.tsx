import { StyleSheet, Text, View } from "react-native";
import { ms } from "react-native-size-matters";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function NotConnected() {
  return (
    <View style={Styles.Container}>
      <Text style={Styles.Text}>Tidak dapat terhubung dengan server</Text>
    </View>
  );
}

const Styles = StyleSheet.create({
  Container: {
    position: "absolute",
    backgroundColor: "#a83246",
    alignItems: "center",
    width,
    zIndex: 1,
    bottom: ms(20),
  },
  Text: {
    fontSize: ms(12),
    color: "#fff",
  },
});
