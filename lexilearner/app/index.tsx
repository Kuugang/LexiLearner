import React from "react";
import { router } from "expo-router"; // Or useNavigation if using React Navigation
import { ScrollView, View } from "react-native";

import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

import Login from "@/components/Auth/Login";
import SpinnerOverlay from "@/components/SpinnerOverlay";

// MOVE THIS
import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId:
    "393477780121-6i4h7kp3f18avqb857j8jlmb5uv5q5j6.apps.googleusercontent.com",
  offlineAccess: true, // Request refresh token
  forceCodeForRefreshToken: true, // Ensure token is provided
  scopes: ["profile", "email"],
});

const Index = () => {
  return (
    <>
      <SpinnerOverlay />
      <ScrollView>
        <VStack
          space="xl"
          className="flex flex-col items-center justify-center"
        >
          <Heading className="text-black">Lexi Learning</Heading>

          <Button
            size="md"
            variant="solid"
            action="primary"
            onPress={() => router.push("/signin")}
          >
            <ButtonText>Login</ButtonText>
          </Button>

          <Button
            size="md"
            variant="solid"
            action="primary"
            onPress={() => router.push("/signup")}
          >
            <ButtonText>Register</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </>
  );
};

export default React.memo(Index);
