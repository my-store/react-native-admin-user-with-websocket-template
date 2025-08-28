import { Text, View } from "react-native";

export default function Register(props: any) {
  return (
    <View>
      <Text>Register Page</Text>
      <Text onPress={() => props.navigation.goBack()}>Batal</Text>
    </View>
  );
}
