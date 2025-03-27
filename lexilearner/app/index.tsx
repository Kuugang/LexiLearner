import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { router } from "expo-router";
import { useTheme, Theme } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import Text from "../components/Text";
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import * as tailwindColors from "tailwindcss/colors";

import reading from "../anims/reading.json";
const { width, height } = Dimensions.get("window");

import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useGlobalContext } from "@/context/GlobalProvider";

import { decodeToken } from "../utils/utils";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useAuthContext } from "@/context/AuthProvider";
import { useAuth } from "@/stores/authStore";
import { getProfile } from "@/services/UserService";
import { login } from "@/services/AuthService";
import { User } from "@/models/User";
import Login from "@/components/Login";
import SpinnerOverlay from "@/components/SpinnerOverlay";

GoogleSignin.configure({
  webClientId:
    "393477780121-6i4h7kp3f18avqb857j8jlmb5uv5q5j6.apps.googleusercontent.com",
  offlineAccess: true, // Request refresh token
  forceCodeForRefreshToken: true, // Ensure token is provided
  scopes: ["profile", "email"],
});

type BooksScreenNavigationProp = StackNavigationProp<{
  BookList: undefined;
  SignIn: undefined;
}>;

interface BooksProps {
  navigation: BooksScreenNavigationProp;
}

const Index: React.FC<BooksProps> = ({ navigation }) => {
  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);
  const isLoggedIn = useAuth((s) => !!s.token);

  const { isLoading, setIsLoading, isLogged } = useGlobalContext();

  const { colors, margin } = useTheme() as Theme & {
    margin: number;
  };

  // Styles
  const styles = StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      borderColor: "red",
      flex: 1,
      alignItems: "center",
      justifyContent: "space-around",
      paddingVertical: 50,
    },
    title: {
      fontSize: 50,
      lineHeight: 60,
      fontWeight: "700",
      marginTop: margin * 2,
    },
    subTitle: {
      fontSize: 17,
      fontWeight: "500",
      marginTop: margin,
      marginBottom: margin * 2,
      textAlign: "center",
    },
  });

  return (
    <>
      <SpinnerOverlay />
      <ScrollView>
        <VStack
          space="xl"
          className="flex flex-col items-center justify-center"
        >
          <View
            style={{
              flex: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
          <Heading>Lexi Learning</Heading>

          <Login />
        </VStack>
      </ScrollView>
    </>
  );
};

export default React.memo(Index);
