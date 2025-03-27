import { ToastAndroid } from "react-native";
import { router } from "expo-router"; // Or useNavigation if using React Navigation
import { signInWithGoogle, tokenAuth } from "../services/AuthService";

export const useGoogleAuth = async () => {
  try {
    const userInfo = await signInWithGoogle();
    if (userInfo) {
      const response = await tokenAuth(0, userInfo.data?.idToken as string);
      console.log(response);

      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      router.push("/home");
    } else {
      ToastAndroid.show("Sign in cancelled", ToastAndroid.SHORT);
    }
  } catch (error) {
    ToastAndroid.show(
      error instanceof Error ? error.message : "An error occurred",
      ToastAndroid.LONG,
    );
  }
};
