import { Platform, ToastAndroid } from "react-native";
import { router } from "expo-router"; // Or useNavigation if using React Navigation
import { signInWithFacebook, tokenAuth } from "../services/AuthService";

import { AccessToken, AuthenticationToken } from "react-native-fbsdk-next";

export const useFacebookAuth = async () => {
  try {
    let token = await signInWithFacebook();

    if (token) {
      const response = await tokenAuth(1, token as string);
      console.log(response);

      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      router.push("/home");
    } else {
      ToastAndroid.show("Sign in cancelled", ToastAndroid.SHORT);
    }
  } catch (error) {
    console.log(error);
  }
};
