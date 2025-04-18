import { useState } from "react";
import { useStories } from "@/services/ReadingMaterial";
import { router } from "expo-router";

// Components
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

import {
  Search,
  ListFilter,
  Check,
  CircleUser,
  Flame,
} from "lucide-react-native";

export default function Explore() {
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
    "Science Fiction",
    "Mystery",
    "Supernatural",
    "Fantasy",
    "Political Intrigue",
    "Paranormal",
    "Romance",
    "Horror",
    "Thriller",
    "Coming of Age",
    "Historical Fiction",
    "Drama",
    "Adventure",
    "Comedy",
    "Metafiction",
  ];

  const filteredStories =
    selectedGenres.size === 0 && query.trim() === ""
      ? null
      : stories?.filter((story) => {
          const matchesGenre =
            selectedGenres.size === 0 ||
            selectedGenres.has(story.Genre) ||
            (Array.isArray(story.Genre) &&
              story.Genre.some((genre) => selectedGenres.has(genre)));

          const matchesQuery =
            query.trim() === "" ||
            story.Title.toLowerCase().includes(query.trim().toLowerCase()) ||
            (story.Author &&
              story.Author.toLowerCase().includes(query.trim().toLowerCase()));

          return matchesGenre && matchesQuery;
        });

  return (
    <ScrollView className="bg-background">
      <View className="flex flex-row gap-2 items-center w-full p-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <CircleUser color="#FFD43B" size={30} />
        </TouchableOpacity>

        <View>
          <Flame color="red" size={30} />
          <Text className="text-red-500 font-bold absolute -bottom-1 -right-1">
            3
          </Text>
        </View>

        <View className="relative flex-1">
          <Search
            size={20}
            color="#888"
            style={{
              position: "absolute",
              left: 10,
              top: 12,
              zIndex: 1,
            }}
          />
          <Input
            className="pl-10 py-3 rounded-lg w-full"
            onChangeText={(value: string) => setQuery(value)}
            placeholder="Search for stories..."
            aria-labelledby="label-for-searchStories"
            aria-errormessage="inputError"
          />
        </View>
      </View>

      <View className="flex flex-row justify-end">
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
        <View className="flex-1 w-full px-4">
          <View className="grid grid-cols-2 gap-4">
            {genres.map((genre) => {
              return (
                <TouchableOpacity
                  key={genre}
                  className={`flex items-center justify-around p-4 rounded-xl bg-orange-500`}
                  onPress={() => toggleGenre(genre)}
                >
                  {/* TODO:  */}
                  <Text className="font-semibold text-center">{genre}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {filteredStories?.length > 0 && (
        <View className="flex flex-col gap-2">
          {filteredStories?.map((item) => (
            <ReadingContent
              key={item.Id}
              Type="QueryView"
              Id={item.Id}
              Title={item.Title}
              Author={item.Author}
              Description={item.Description}
              Cover={item.Cover}
              Content={item.Content}
              Genre={item.Genre}
              Difficulty={item.Difficulty}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
