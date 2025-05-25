import React, { memo, useEffect, useState, useCallback, useRef } from "react";
import { router } from "expo-router";
import {
  useRecommendedStories,
  useStories,
} from "@/services/ReadingMaterialService";
import ReadingContent from "@/components/ReadingContent";
import { useFocusEffect } from "@react-navigation/native";
import { ReadingContentType } from "@/models/ReadingContent";

//Components
import {
  Image,
  Dimensions,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";

import { useUserStore } from "@/stores/userStore";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { HeaderSearchBar } from "@/components/HeaderSearchBar";

function HomeScreen() {
  const { data: stories, isLoading: isStoriesLoading } = useStories();
  const { data: recommendations } = useRecommendedStories();
  const [showStreak, setShowStreakModal] = useState(false);
  const user = useUserStore((state) => state.user);
  const lastLoginStreak = useUserStore((state) => state.lastLoginStreak);
  const setLastLoginStreak = useUserStore((state) => state.setLastLoginStreak);
  const setSelectedContent = useReadingContentStore(
    (state) => state.setSelectedContent
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
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

  const performSearch = useCallback(
    (query: string) => {
      if (query.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      if (!stories) return;

      setIsSearching(true);

      const filtered = stories.filter((story) => {
        const matchesTitle = story.title
          .toLowerCase()
          .includes(query.trim().toLowerCase());
        const matchesAuthor = story.author
          ?.toLowerCase()
          .includes(query.trim().toLowerCase());
        const matchesGenre = story.genres?.some((genre: string) =>
          genre.toLowerCase().includes(query.trim().toLowerCase())
        );

        return matchesTitle || matchesAuthor || matchesGenre;
      });

      setSearchResults(filtered);
      setIsSearching(false);
    },
    [stories]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchQuery("");
        setSearchResults([]);
      };
    }, [])
  );

  const streak = useUserStore((state) => state.streak);
  const activeWeekdays = [true, true, true, false, false, false, false];

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const dimensionHandler = Dimensions.addEventListener(
      "change",
      ({ window }) => {
        setScreenWidth(window.width);
      }
    );

    return () => {
      dimensionHandler.remove();
    };
  }, []);

  const handleSearchFocus = () => {
    console.log("Search focused");
  };

  const handleSearchBlur = () => {
    console.log("Search blur");
  };

  const handleResultPress = (item: ReadingContentType) => {
    console.log("Item selected:", item.id);

    setSelectedContent(item);
    setSearchQuery("");
    setSearchResults([]);

    router.push(`/content/${item.id}`);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const imageWidth = Math.min(200, screenWidth * 0.4);
  const imageHeight = imageWidth;

  const showSearchResults = searchQuery.trim() !== "";

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="bg-background"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={{ position: "relative" }}>
          <HeaderSearchBar
            user={user}
            streak={streak}
            showStreak={showStreak}
            setShowStreakModal={setShowStreakModal}
            activeWeekdays={activeWeekdays}
            placeholder="Search for stories..."
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchFocus={handleSearchFocus}
            onSearchBlur={handleSearchBlur}
            onClearSearch={handleClearSearch}
          />
        </View>

        {/* Search Results Section */}
        {showSearchResults && (
          <View className="flex-1 w-full p-4">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-600">
                {isSearching
                  ? "Searching..."
                  : `${searchResults.length} result${
                      searchResults.length !== 1 ? "s" : ""
                    } for "${searchQuery}"`}
              </Text>
            </View>

            {isSearching ? (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500">Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View className="flex flex-col gap-4">
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleResultPress(item)}
                    activeOpacity={0.7}
                    className="flex flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <Image
                      source={{ uri: item.cover }}
                      style={{
                        width: 80,
                        height: 120,
                        borderRadius: 6,
                      }}
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="font-bold text-lg mb-1">
                        {item.title}
                      </Text>
                      {item.author && (
                        <Text className="text-gray-600 mb-2">
                          By {item.author}
                        </Text>
                      )}
                      <Text
                        className="text-gray-700 text-sm leading-5"
                        numberOfLines={4}
                        ellipsizeMode="tail"
                      >
                        {item.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500 text-center">
                  No stories found matching "{searchQuery}"
                </Text>
                <Text className="text-gray-400 text-center mt-2 text-sm">
                  Try different keywords or check spelling
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Normal Content - Only show when not searching */}
        {!showSearchResults && (
          <>
            <View
              className="flex flex-row items-center px-4 py-4 mb-2 bg-yellowOrange"
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
                  recommendations.map((r, index) => (
                    <View className="w-[90vw]" key={index}>
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
                {!isStoriesLoading &&
                Array.isArray(stories) &&
                stories?.length > 0
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
                      <Text className="text-gray-500">
                        No stories available.
                      </Text>
                    )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default memo(HomeScreen);
