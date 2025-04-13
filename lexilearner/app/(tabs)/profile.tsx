import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthProvider";
import { useUserContext } from "@/context/UserProvider";

import { ScrollView, View, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  Settings,
  Flame,
  Book,
  Smartphone,
  Star,
  Medal,
  Award,
  Trophy,
} from "lucide-react-native";

import ProfileStat from "@/components/ProfileStat";
import BackHeader from "@/components/BackHeader";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const { user, updateProfile } = useUserContext();
  const { logout } = useAuthContext();

  return (
    <ScrollView>
      <View
        style={{
          height: 150,
          width: "100%",
          borderBottomLeftRadius: "30px",
        }}
        className="bg-orange-500 p-4 shadow-lg"
      >
        <View className="flex flex-row justify-between">
          <BackHeader />

          <Button
            className="self-end bg-transparent"
            onPress={async () => {
              router.push("profile/profileSettings");
            }}
          >
            <Settings />
          </Button>
        </View>
      </View>

      <View
        className="flex p-8 gap-4"
        style={{ position: "relative", bottom: 69 }}
      >
        <View
          style={{
            borderRadius: "100%",
            borderColor: "white",
            width: 140,
            height: 140,
            padding: 6,
            backgroundColor: "white",
          }}
          className="shadow-lg"
        >
          <Image
            source={require("@/assets/images/leeseopp.png")}
            style={{
              borderRadius: "100%",
              width: "100%",
              height: "100%",
            }}
            alt="User profile pic"
          />
        </View>

        <View className="w-full mt-4 flex gap-4">
          <View className="flex-row justify-between">
            <View className="pb-5">
              <Text className="text-lg font-bold">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text>@{user?.userName}</Text>
            </View>

            <View>
              <View className="flex flex-row gap-2 items-center">
                <FontAwesomeIcon style={{ color: "yellow" }} icon={faBolt} />
                <Text className="text-lg font-bold">{user?.level}</Text>
              </View>
              <Text className="text-sm text-gray-800">
                Reading Compr. Level
              </Text>
            </View>
          </View>

          <Text className="text-xl font-bold">Overview</Text>

          <View className="grid grid-cols-2 gap-2">
            <ProfileStat
              level={"3"}
              description="Longest Streak"
              icon={<Flame style={{ color: "red" }} />}
            />
            <ProfileStat
              level={"10"}
              description="Books Read"
              icon={<Book style={{ color: "blue" }} />}
            />
            <ProfileStat
              level={"4.5 Hours"}
              description="Avg. Screentime"
              icon={<Smartphone />}
            />
            <ProfileStat
              level={"2"}
              description="Achievements"
              icon={<Star style={{ color: "yellow" }} />}
            />
          </View>

          <View className="flex-row justify-between">
            <Text className="text-xl font-bold">Achievements</Text>
            <Text
              underline
              onPress={async () => {
                router.push("profile/achievements");
              }}
            >
              View All
            </Text>
          </View>

          <View className="flex-row flex gap-4">
            <View className="p-4 rounded-md bg-yellow-500 shadow-md">
              <Award style={{ width: 30, height: 30 }} />
            </View>

            <View className="p-4 rounded-md bg-yellow-500 shadow-md">
              <Medal style={{ width: 30, height: 30 }} />
            </View>
            <View className="p-4 rounded-md bg-yellow-500 shadow-md">
              <Trophy style={{ width: 30, height: 30 }} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
