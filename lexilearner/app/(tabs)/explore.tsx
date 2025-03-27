import { Text } from "@/components/ui/text";
import { StyleSheet, View } from "react-native";

export default function Explore() {
  return (
    <View style={styles.container}>
      <Text>Explore View</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
