import { router } from "expo-router";
import {
  useRecommendedStories,
  useStories,
} from "@/services/ReadingMaterialService";
import { memo, useEffect, useState } from "react";
import ReadingContent from "@/components/ReadingContent";
import LoginStreak from "@/components/LoginStreak";

//Components
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

import { CircleUser, Search, Flame } from "lucide-react-native";
import { useUserStore } from "@/stores/userStore";
import { StreakIcon } from "@/components/Streak";
import { HeaderSearchBar } from "@/components/HeaderSearchBar";

function HomeScreen() {
  const { data: stories, isLoading: isStoriesLoading } = useStories();
  const { data: recommendations } = useRecommendedStories();
  const [showStreak, setShowStreakModal] = useState(false);
  const user = useUserStore((state) => state.user);
  const lastLoginStreak = useUserStore((state) => state.lastLoginStreak);
  const setLastLoginStreak = useUserStore((state) => state.setLastLoginStreak);

  // Show streak modal when component mounts
  useEffect(() => {
    // Check if it's a new day since last login or first-time user
    // This is where you would add your logic to determine if the streak should be shown
    // For demo purposes, we'll just show it after a short delay

    const today = new Date().toISOString().split("T")[0];
    console.log("TODAY", today, "LOGINTREAKS:", lastLoginStreak);
    if (today !== lastLoginStreak && user?.role === "Pupil") {
      const timer = setTimeout(() => {
        setShowStreakModal(true);
        setLastLoginStreak(today);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const streak = useUserStore((state) => state.streak);
  const activeWeekdays = [true, true, true, false, false, false, false];

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  );

  useEffect(() => {
    const dimensionHandler = Dimensions.addEventListener(
      "change",
      ({ window }) => {
        setScreenWidth(window.width);
      },
    );

    return () => {
      dimensionHandler.remove();
    };
  }, []);

  const imageWidth = Math.min(200, screenWidth * 0.4);
  const imageHeight = imageWidth;
  // return <RankUp />;
  return (
    <ScrollView className="bg-background">
      {/* TODO: MAKE THIS INTO COMPONENT*/}
      <HeaderSearchBar
        user={user}
        streak={streak}
        showStreak={showStreak}
        setShowStreakModal={setShowStreakModal}
        activeWeekdays={activeWeekdays}
        onSearchFocus={() => router.push("/explore")}
        placeholder="Search for stories..."
      />

      <View
        className="flex flex-row items-center px-4 py-4 bg-yellowOrange"
        style={{ borderBottomLeftRadius: 40 }}
      >
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            style={{
              padding: 12,
              fontSize: screenWidth < 400 ? 24 : 30,
              fontWeight: "bold",
              flexWrap: "wrap",
            }}
            className="text-black"
          >
            Ready for a Journey?
          </Text>
        </View>
        <Image
          source={require("@/assets/images/woman-reading-2.png")}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
          resizeMode="contain"
        />
      </View>

      <View className="flex-1  w-full h-60 p-4">
        <Text className="text-2xl font-bold">Recommended</Text>
        <ScrollView horizontal={true}>
          {recommendations &&
            recommendations.length > 0 &&
            recommendations.map((r) => (
              <View className="w-[90vw]">
                <ReadingContent
                  type={"Recommended"}
                  id={r.id}
                  content={r.content}
                  title={r.title}
                  author={r.author}
                  description={r.description}
                  cover={r.cover}
                  genres={r.genres}
                  difficulty={r.difficulty}
                />
              </View>
            ))}
        </ScrollView>
      </View>

      <View className="flex-1 gap-4 w-full p-8">
        <Text className="text-2xl font-bold">Explore</Text>
        {isStoriesLoading && <Text>Loading stories...</Text>}
        <View className="flex flex-row justify-between flex-wrap">
          {!isStoriesLoading && Array.isArray(stories) && stories?.length > 0
            ? stories?.map((item) => (
                <View key={item.id}>
                  <ReadingContent
                    type="ScrollView"
                    id={item.id}
                    title={item.title}
                    author={item.author}
                    description={item.description}
                    cover={item.cover}
                    content={item.content}
                    genres={item.genres}
                    difficulty={item.difficulty}
                  />
                </View>
              ))
            : !isStoriesLoading && (
                <Text className="text-gray-500">No stories available.</Text>
              )}
        </View>
      </View>
    </ScrollView>
  );
}

export default memo(HomeScreen);
