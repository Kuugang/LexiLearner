import { View, Image, Button, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// tanginang copy paste css yan
export function NewClassroomBtn() {
  // Make or Join Classroom ??
  let role = "teacher";
  return (
    <View className="border-2 rounded-xl border-gray-300 my-4 shadow-main">
      <View className="p-6">
        <View className="items-center">
          <FontAwesomeIcon size={25} icon={faPlus} />
          <Text className="my-2">
            {role === "teacher" ? "Make New Classroom" : "Join Classroom"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function AddActivity() {
  return (
    <View className="border-2 rounded-xl border-gray-300 my-4 shadow-main">
      <View className="p-6">
        <View className="items-center">
          <FontAwesomeIcon size={25} icon={faPlus} />
          <Text className="my-2">Add New Activity</Text>
        </View>
      </View>
    </View>
  );
}

export function Activity() {
  return (
    <View className="border-2 rounded-xl border-gray-300 my-1 shadow-main">
      <View className="p-3 py-3">
        <View className="items-center flex-row mr-4">
          <Image
            source={require("@/assets/images/cat-in-the-hat.png")}
            resizeMode="contain"
            className="rounded-xl mx-2"
            alt="book for activity"
            style={{ width: "50%" }}
          />
          <View className="flex-1">
            <Text className="font-bold">Cat in the Hat</Text>
            <Text>Learn what the cat has done for the day.</Text>
            <View className="items-center">
              <TouchableOpacity className="w-[75%] bg-yellow-500 rounded-lg py-2 items-center mt-2">
                <Text className="font-semibold">Progress</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
