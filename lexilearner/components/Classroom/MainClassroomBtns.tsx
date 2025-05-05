import { View, Image, Button, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";

// tanginang copy paste css yan
export function NewClassroomBtn() {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/classroom/createclassroom");
      }}
    >
      <View className="border-2 rounded-xl border-lightGray my-4 border-b-4">
        <View className="p-6">
          <View className="items-center">
            <FontAwesomeIcon size={25} icon={faPlus} />
            <Text className="my-2">Make New Classroom</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function JoinClassroomBtn() {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/classroom/joinclassroom");
      }}
    >
      <View className="border-2 rounded-xl border-lightGray my-4 border-b-4">
        <View className="p-6">
          <View className="items-center">
            <FontAwesomeIcon size={25} icon={faPlus} />
            <Text className="my-2">Join a Classroom</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function AddActivity() {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/classroom/createactivity");
      }}
    >
      <View className="border-2 rounded-xl border-lightGray my-4 border-b-4">
        <View className="p-6">
          <View className="items-center">
            <FontAwesomeIcon size={25} icon={faPlus} />
            <Text className="my-2">Add New Activity</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function Activity() {
  return (
    <View className="border-2 rounded-xl border-lightGray border-b-4 my-1 p-4">
      <View className="items-center flex-row">
        <Image
          source={require("@/assets/images/cat-in-the-hat.png")}
          resizeMode="contain"
          className="rounded-xl"
          alt="book for activity"
          style={{ width: 125, height: 125 }}
        />
        <View className="flex-1">
          <Text className="font-bold">Cat in the Hat</Text>
          <Text>Learn what the cat has done for the day.</Text>
          <TouchableOpacity className="w-[75%] bg-yellowOrange rounded-lg py-2 items-center mt-2 drop-shadow-custom">
            <Text className="font-semibold">Progress</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
