import { useState, memo, useEffect } from "react";
import {
  useStories,
  getFilteredStories,
  ReadingMaterialFilters,
} from "@/services/ReadingMaterialService";
import { router } from "expo-router";

import ReadingContent from "@/components/ReadingContent";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { Search, ListFilter, Check, CircleUser } from "lucide-react-native";
import { ReadingContentType } from "@/models/ReadingContent";
import { StreakIcon } from "@/components/Streak";
import { useUserStore } from "@/stores/userStore";
import { HeaderSearchBar } from "@/components/HeaderSearchBar";

function Explore() {
  const streak = useUserStore((state) => state.streak);
  const activeWeekdays = [true, true, true, false, false, false, false];

  const [showStreak, setShowStreakModal] = useState(false);
  const user = useUserStore((state) => state.user);

  const { data: stories, isLoading: isStoriesLoading } = useStories();
  const [query, setQuery] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(genre)) {
        newSet.delete(genre);
      } else {
        newSet.add(genre);
      }

      return newSet;
    });
  };

  const genres: string[] = [
    "Adventure",
    "Romance",
    "Drama",
    "Comedy",
    "Fantasy",
    "Horror",
    "Mystery",
    "Science Fiction",
    "History",
    "Coming of Age",
    "Non-Fiction",
    "Fiction",
    "Passage",
    "Animal",
    "Poetry",
    "Educational",
  ];

  const filteredStories =
    selectedGenres.size === 0 && query.trim() === ""
      ? null
      : stories?.filter((story) => {
          const matchesGenre =
            selectedGenres.size === 0 ||
            (Array.isArray(story.genres) &&
              story.genres.some((genre) => selectedGenres.has(genre)));

          const matchesQuery =
            query.trim() === "" ||
            story.title.toLowerCase().includes(query.trim().toLowerCase()) ||
            (story.author &&
              story.author.toLowerCase().includes(query.trim().toLowerCase()));

          return matchesGenre && matchesQuery;
        });

  return (
    <ScrollView className="bg-background">
      <HeaderSearchBar
        user={user}
        streak={streak}
        showStreak={showStreak}
        setShowStreakModal={setShowStreakModal}
        activeWeekdays={activeWeekdays}
        placeholder="Search for stories..."
        searchValue={query}
        onSearchChange={setQuery}
      />

      <View className="flex flex-row justify-end px-4 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ListFilter size={20} color="#888" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 native:w-72">
            <DropdownMenuLabel>Genre</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {genres.map((genre, i) => {
              const isChecked = selectedGenres.has(genre);
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => toggleGenre(genre)}
                  className="flex-row items-center mb-2 gap-2"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleGenre(genre)}
                    className="w-5 h-5 border border-gray-400 rounded items-center justify-center"
                  >
                    {isChecked && <Check className="w-4 h-4 text-white" />}
                  </Checkbox>
                  <Text>{genre}</Text>
                </TouchableOpacity>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </View>

      {!filteredStories && (
        <View className="flex-1 w-full px-8 py-2">
          <View className="grid grid-cols-2 gap-2">
            {genres.map((genre) => {
              return (
                <Button
                  variant="dropshadow"
                  size={null}
                  key={genre}
                  className={`border-lightGray !border-2 !my-0`}
                  onPress={() => toggleGenre(genre)}
                >
                  <Text className="font-semibold text-center">{genre}</Text>
                </Button>
              );
            })}
          </View>
        </View>
      )}

      {filteredStories && filteredStories.length > 0 && (
        <View className="flex flex-col gap-2 px-8">
          {filteredStories?.map((item) => (
            <ReadingContent
              key={item.id}
              type="QueryView"
              id={item.id}
              title={item.title}
              author={item.author}
              description={item.description}
              cover={item.cover}
              content={item.content}
              genres={item.genres}
              difficulty={item.difficulty}
            />
          ))}
        </View>
      )}

      {filteredStories && filteredStories.length === 0 && (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-gray-500 text-center">
            No stories found matching your search criteria.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
export default memo(Explore);
