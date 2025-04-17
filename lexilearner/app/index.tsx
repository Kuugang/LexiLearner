import React, { useEffect } from "react";
import { Redirect, router } from "expo-router"; // Or useNavigation if using React Navigation

import { ScrollView, View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useUserStore } from "@/stores/userStore";

const Index = () => {
  const user = useUserStore((state) => state.user);

  if (user) {
    return <Redirect href="/home" />;
  }

  return (
    <ScrollView
      className="bg-yellowOrange"
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
          className="w-full bg-orange rounded-lg"
        >
          <Text className="text-white text-lg font-bold">Register</Text>
        </Button>

        {/* Log In Button */}
        <Button
          onPress={() => {
            router.push("/signin");
          }}
          className="w-full border border-orange bg-white rounded-lg "
        >
          <Text className="text-orange text-lg font-bold">Log In</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default React.memo(Index);
