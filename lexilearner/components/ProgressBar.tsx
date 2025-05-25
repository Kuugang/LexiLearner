import React, { useState } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Text,
} from "react-native";
import { Progress } from "./ui/progress";
import { Crown } from "lucide-react-native";

function TierName(level: number) {
  var tierName = "test";
  switch (true) {
    case level >= 12000:
      tierName = "Literary Champion";
      break;
    case level >= 8000:
      tierName = "Scholar";
      break;
    case level >= 5500:
      tierName = "Master Reader";
      break;
    case level >= 3500:
      tierName = "Expert Reader";
      break;
    case level >= 2000:
      tierName = "Advanced Reader";
      break;
    case level >= 1000:
      tierName = "Skilled Reader";
      break;
    case level >= 500:
      tierName = "Consistent Reader";
      break;
    case level >= 250:
      tierName = "Developing Reader";
      break;
    case level >= 100:
      tierName = "Curious Reader";
      break;
    default:
      tierName = "Novice Reader";
      break;
  }

  return tierName;
}

// level 132 -> 250
export function ProgressBar({ level }: { level: number }) {
  const [currentTier, nextTier] = getTierThresholds(level);
  const nextTierName = TierName(nextTier);
  const XPleft = nextTier - level;

  return (
    <View className="border-2 rounded-xl border-lightGray border-b-4 py-8 px-4">
      <View className="flex flex-row">
        <View className="mr-4 h-[20px] w-[20px]">
          <Crown color="black" />
        </View>
        <View className="my-2 flex-1">
          <Progress
            value={level === currentTier ? 0 : (level / nextTier) * 100}
            className="web:w-[60%] bg-lightGray"
            indicatorClassName="bg-lightYellow"
          />
        </View>
      </View>
      <View className="flex flex-row justify-between">
        <Text>{XPleft}xp left</Text>
        <Text className="font-bold">{nextTierName}</Text>
      </View>
    </View>
  );
}

export function CurrentTierName({ level }: { level: number }) {
  const tierName = TierName(level);

  return (
    <View className="px-6 py-1 bg-lightBlue rounded-md">
      <Text className="font-bold">{tierName}</Text>
    </View>
  );
}

function getTierThresholds(level: number): [number, number] {
  const tierLevels = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000];
  let currLevel, nextLevel;

  if (level >= 12000) {
    return [12000, 12000];
  }

  // 132 -> 250
  for (var i = 0; i < tierLevels.length; i++) {
    if (level < tierLevels[i]) {
      currLevel = tierLevels[i - 1];
      nextLevel = tierLevels[i] ?? currLevel;

      return [currLevel, nextLevel];
    }
  }

  return [0, 100];
}
