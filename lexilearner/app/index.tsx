import React from "react";
import { router } from "expo-router"; // Or useNavigation if using React Navigation

import { ScrollView, View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <View className="absolute w-[600px] h-[600px] bg-background-0 rounded-full -top-20 left-0 -z-10"></View>
      {/* Illustration */}
      <Image
        source={require("@/assets/images/woman-reading.png")}
        className="absolute top-16 left-1/2 -translate-x-1/2 w-60 h-60"
        resizeMode="contain"
        alt=""
      />

      {/* Title */}
      <Text className="text-3xl font-bold text-gray-900 mt-72">
        LexiLearner
      </Text>

      {/* Buttons Section */}
      <View className="w-full mt-12 space-y-4 gap-2 px-6">
        {/* Register Button */}
        <Button
          onPress={() => {
            router.push("/signup");
          }}
          className="w-full bg-orange-500 rounded-lg"
        >
          <Text className="text-white text-lg font-bold">Register</Text>
        </Button>

        {/* Log In Button */}
        <Button
          onPress={() => {
            router.push("/signin");
          }}
          className="w-full border border-orange-500 bg-white rounded-lg "
        >
          <Text className="text-orange-500 text-lg font-bold">Log In</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default React.memo(Index);
