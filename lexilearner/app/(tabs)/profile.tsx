import { Text } from "@/components/ui/text";
import { StyleSheet, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthProvider";

export default function Profile() {
  const { logout } = useAuthContext();

  return (
    <View style={styles.container}>
      <Text>Profile</Text>

      <Button>
        <ButtonText
          onPress={async () => {
            await logout();
            router.push("/");
          }}
        >
          LogOut
        </ButtonText>
      </Button>
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
