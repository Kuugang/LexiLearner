import { useState } from "react";
import { useStories } from "@/services/ReadingMaterial";
import { router } from "expo-router";

// Components

import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import {
  Popover,
  PopoverBackdrop,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
} from "@/components/ui/popover";
import { CheckIcon } from "@/components/ui/icon";

import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { SearchIcon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart,
  faWandMagicSparkles,
  faFlask,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import ReadingContent from "@/components/ReadingContent"; // adjust path as needed

export default function Explore() {
  const { data: stories, isLoading: isStoriesLoading } = useStories();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

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

  const filteredStories = selectedGenre
    ? stories?.filter((story) => story.Genre.includes(selectedGenre))
    : null;

  return (
    <ScrollView>
      <View className="p-8 flex gap-4">
        <View className="flex flex-row gap-2">
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

          <Input className="rounded-lg">
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField placeholder="Search stories..." />
          </Input>
        </View>

        <View className="flex flex-row items-center justify-between">
          <Text className="font-semibold">Genres</Text>
          <Checkbox size="md" isInvalid={false} isDisabled={false}>
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>Label</CheckboxLabel>
          </Checkbox>
        </View>

        {!selectedGenre && (
          <View className="flex-1 w-full px-4">
            <Text className="font-bold text-2xl mb-2">Genres</Text>

            <View className="grid grid-cols-2 gap-4">
              {genres.map((genre) => {
                return (
                  <TouchableOpacity
                    key={genre}
                    className={`flex items-center justify-around p-4 rounded-xl bg-background-yellowOrange`}
                    onPress={() =>
                      setSelectedGenre((prev) =>
                        prev === genre ? null : genre,
                      )
                    }
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

        {selectedGenre && (
          <View className="mt-6 px-4">
            <Text className="font-bold text-xl mb-2">
              {`${selectedGenre} Stories`}
            </Text>

            {filteredStories?.map((item) => (
              <ReadingContent
                key={item.Id}
                Type="ScrollView"
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
      </View>
    </ScrollView>
  );
}
