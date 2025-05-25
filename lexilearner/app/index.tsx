import React, { useEffect } from "react";
import { Redirect, router } from "expo-router"; // Or useNavigation if using React Navigation
import { useUserStore } from "@/stores/userStore";
import { useMiniGameStore } from "@/stores/miniGameStore";

//Components
import { ScrollView, View, Image, TouchableOpacity } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { refreshAccessToken } from "@/services/AuthService";

export default function Index() {
  const user = useUserStore((state) => state.user);
  const currentMinigame = useMiniGameStore((state) => state.currentMinigame);

  if (user) {
    refreshAccessToken();
    if (currentMinigame && user.role === "Pupil") {
      return <Redirect href="/minigames/play" />;
    } else {
      // return <Redirect href="/home" />;
    }
  }

  return (
    <ScrollView
      className="bg-yellowOrange h-full"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <View className="h-[60vh] w-full rounded-bl-[40px] bg-white">
        <View className="flex-1 justify-between">
          <Text className="text-orange font-bold text-[30px] m-12 mt-18">
            Improve reading,{"\n"}Improve fun!
          </Text>
          <Image
            source={require("@/assets/images/Juicy/girl-with-pencil.png")}
            className="w-[40vh] h-[40vh] self-end"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* <View className="absolute w-[600px] h-[600px] bg-background-0 rounded-full -top-20 left-0 -z-10"></View> */}

      <View className="flex-1 w-full flex flex-col justify-around items-center">
        <Text className="text-[30px] font-bold text-orange mt-8">
          LexiLearner
        </Text>

        <View className="w-full gap-2 px-6 items-center">
          <TouchableOpacity
            onPress={() => router.push("/signup")}
            className="w-4/5 bg-orange border border-dropShadowColor rounded-xl border-b-4 p-3 items-center"
          >
            <Text className="text-white text-md font-bold">Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/signin")}
            className="w-4/5 border border-dropShadowColor bg-white rounded-xl border-b-4 p-3 items-center"
          >
            <Text className="text-orange text-md font-bold leading-tight">
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
