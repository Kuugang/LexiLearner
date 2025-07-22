import IntroCarousel from "@/components/IntroCarousel";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import React from "react";
import { View, Text, SafeAreaView } from "react-native";

const carousel = () => {
  const data = [
    {
      text: "Learn while you're reading",
      image: require("assets/images/intro/intro1.png"),
    },
    {
      text: "Play minigames and collect rewards",
      image: require("assets/images/intro/intro2.png"),
    },
    {
      text: "A lot of books waiting for you!",
      image: require("assets/images/intro/intro3.png"),
    },
  ];

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1">
        <IntroCarousel data={data} />

        <View className="px-10 pb-8">
          <Button onPress={() => router.push("/signin")}>
            <Text className="font-bold text-lg text-black">Next</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default carousel;
