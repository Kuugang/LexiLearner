import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { MinigameType } from "@/models/Minigame";
import { Ionicons } from "@expo/vector-icons";
import { Menu, Button } from "react-native-paper";

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

export function AddReadingAssignment() {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/classroom/createactivity-choosebook");
      }}
    >
      <View className="border-2 rounded-xl border-lightGray my-4 border-b-4">
        <View className="p-6">
          <View className="items-center">
            <FontAwesomeIcon size={25} icon={faPlus} />
            <Text className="my-2">Choose Book</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SetMinigameDropdown({
  selected,
  setSelected,
}: {
  selected: MinigameType;
  setSelected: (val: MinigameType) => void;
}) {
  const [visible, setVisible] = useState(false);

  const minigameOptions = [
    { label: "2 Truths 1 Lie", value: MinigameType.TwoTruthsOneLie },
    { label: "Fill in the Blanks", value: MinigameType.FillInTheBlanks },
    { label: "Word Hunt", value: MinigameType.WordHunt },
    {
      label: "Sentence Rearrangement",
      value: MinigameType.SentenceRearrangement,
    },
    { label: "Words From Letters", value: MinigameType.WordsFromLetters },
  ];

  const selectedLabel =
    minigameOptions.find((option) => option.value === selected)?.label ??
    "Select Minigame";

  return (
    <View className="flex flex-row items-center">
      <Text className="font-bold mr-2">Set Minigame?</Text>
      <View className="flex flex-1">
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setVisible(true)}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              {selectedLabel}
            </Button>
          }
        >
          {Object.entries(minigameOptions).map(([key, option]) => (
            <Menu.Item
              key={option.value}
              onPress={() => {
                setSelected(option.value);
                setVisible(false);
              }}
              title={option.label}
            />
          ))}
        </Menu>
      </View>
    </View>
  );
}
