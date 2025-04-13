import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View } from "react-native";
import { Image } from "@/components/ui/image";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TrashIcon } from "@/components/ui/icon";
import { faBarChart, faTrashCan } from "@fortawesome/free-solid-svg-icons";

// regular listing
export function StudentDisplay() {
  return (
    <View className="border-2 rounded-xl border-gray-300 my-1">
      <View className="p-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Image
              source={require("@/assets/images/leeseopp.png")}
              className="rounded-xl w-14 h-14" // hardcoded sizing DD;
              size="lg"
              alt="User profile pic"
            />
            <Text bold className="px-5">
              Leeseo
            </Text>
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
    <View className="border-2 rounded-xl border-gray-300 my-1">
      <View className="p-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text bold className="mr-3">
              1st
            </Text>
            <Image
              source={require("@/assets/images/leeseopp.png")}
              className="rounded-xl w-14 h-14" // hardcoded sizing DD;
              size="lg"
              alt="User profile pic"
            />
            <Text bold className="px-5">
              Leeseo
            </Text>
          </View>
          <Text bold>1200 Lvl</Text>
        </View>
      </View>
    </View>
  );
}
