import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBarChart, faTrashCan } from "@fortawesome/free-solid-svg-icons";

// hardcoded. images weirdo mag sizing

// regular listing
export function StudentDisplay() {
  return (
    <View className="border-2 rounded-xl border-gray-300 my-1 shadow-main">
      <View className="p-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            {/* <Image
              source={require("@/assets/images/leeseopp.png")}
              resizeMode="contain"
              className="rounded-xl"
              alt="User profile pic"
            /> */}
            <Text className="px-5">Leeseo</Text>
          </View>
          <View className="flex-row">
            <FontAwesomeIcon icon={faBarChart} size={18} />
            <FontAwesomeIcon icon={faTrashCan} size={18} />
          </View>
        </View>
      </View>
    </View>
  );
}

// leaderboard listing
export function StudentLeaderboardDisplay() {
  return (
    <View className="border-2 rounded-xl border-gray-300 my-1 shadow-main">
      <View className="p-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="mr-3 font-bold">1st</Text>
            {/* <Image
              source={require("@/assets/images/leeseopp.png")}
              resizeMode="cover"
              className="rounded-xl w-5 h-5"
              alt="leaderboard profile pic"
            /> */}
            <Text className="px-5">Leeseo</Text>
          </View>
          <Text className="font-bold">1200 Lvl</Text>
        </View>
      </View>
    </View>
  );
}
