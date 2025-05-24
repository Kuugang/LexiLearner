import React, { memo, useEffect, useState, useCallback, useRef } from "react";
import { router } from "expo-router";
import { useStories } from "@/services/ReadingMaterialService";
import ReadingContent from "@/components/ReadingContent";
import LoginStreak from "@/components/LoginStreak";
import { useFocusEffect } from "@react-navigation/native";
import { ReadingContentType } from "@/models/ReadingContent";

//Components
import {
  Dimensions,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "react-native";
import { Text } from "~/components/ui/text";

import { useUserStore } from "@/stores/userStore";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { HeaderSearchBar } from "@/components/HeaderSearchBar";

function HomeScreen() {
  const { data: stories, isLoading: isStoriesLoading } = useStories();
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

            <View className="flex-1 w-full h-60 p-4">
              <Text className="text-2xl font-bold">Recommended</Text>

              <ReadingContent
                type={"Recommended"}
                id={"123"}
                content={`
          This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It's a perfect book for both independent reading and family read-aloud sessions!

          "Cat in the Hat" is a delightful and whimsical story by Dr. Seuss, packed with fun and chaos. The plot revolves around a young brother and sister who are stuck indoors on a rainy day. Their boredom is quickly turned upside down when the mischievous Cat in the Hat shows up, bringing along his troublesome friends, Thing 1 and Thing 2. Together, they cause mayhem and mess, but they also help turn the day into an unforgettable adventure. 

          The Cat's antics and the antics of his companions are a source of laughter and imagination, all while teaching important lessons about responsibility and the consequences of causing trouble. This story is known for its simple rhymes and repetitive words, making it perfect for young readers to follow along with and build their reading skills. Whether it's parents, teachers, or kids, "Cat in the Hat" has earned a lasting spot in the hearts of many for its playful nature and engaging characters.

          Dr. Seuss's trademark use of vibrant illustrations and clever wordplay makes the story even more fun. The characters like Thing 1 and Thing 2, and the talking fish, add to the charm and humor. The book's smaller format and easy-to-read design make it great for kids aged 3-7 to practice reading on their own. 

          This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It's a perfect book for both independent reading and family read-aloud sessions!
        `}
                title={"Cat In The Hat"}
                author={"Dr. Seuss"}
                description="Have a ball with Dr. Seuss and the Cat in the Hat in this classic picture book...but don't forget to clean up your mess!
      Then he said That is that.
      And then he was gone
      With a tip of his hat.
      A dreary day turns into a wild romp when this beloved story introduces readers to the Cat in the Hat and his troublemaking friends, Thing 1 and Thing 2 – And don't forget Fish! A favorite among kids, parents and teachers, this story uses simple words and basic rhyme to encourage and delight beginning readers.
      Originally created by Dr. Seuss himself, Beginner Books are fun, funny, and easy to read. These unjacketed hardcover early readers encourage children to read all on their own, using simple words and illustrations. Smaller than the classic large format Seuss picture books like The Lorax and Oh, The Places You'll Go!, these portable packages are perfect for practicing readers ages 3-7, and lucky parents too!"
                cover="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1468890477i/233093.jpg"
                genres={["Fiction"]}
                difficulty={10}
              />
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
