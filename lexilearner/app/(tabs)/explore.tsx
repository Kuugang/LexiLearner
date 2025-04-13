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
  faHeart,
  faWandMagicSparkles,
  faFlask,
  faFilter,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Search, ListFilter, Check } from "lucide-react-native";

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
    <ScrollView>
      <View className="flex flex-col h-20 justify-center items-end">
        <View className="flex flex-row gap-2 justify-center">
          <Button
            className="bg-transparent self-start p-0"
            onPress={() => router.push("/profile")}
          >
            <FontAwesomeIcon
              style={{ color: "#FFD43B" }}
              size={30}
              icon={faUser}
            />
          </Button>

          <View className="relative">
            <Search className="absolute left-2 top-2" />
            <Input
              className="p-10 rounded-lg"
              value={query}
              onChangeText={(value: string) => setQuery(value)}
              placeholder="Search for stories..."
              aria-labelledby={`label-for-searchStories`}
              aria-errormessage="inputError"
            />
          </View>
        </View>
      </View>

      <View className="flex flex-row justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ListFilter />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 native:w-72">
            <DropdownMenuLabel>Genre</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {genres.map((genre) => {
              const isChecked = selectedGenres.has(genre);

              return (
                <TouchableOpacity
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
                  className={`flex items-center justify-around p-4 rounded-xl bg-background-yellowOrange`}
                  onPress={() => toggleGenre(genre)}
                >
                  {/* TODO:  */}
                  <FontAwesomeIcon size={30} icon={faHeart} />
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
