import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View } from "react-native";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthProvider";
import { User } from "@/models/User";
import { Heading } from "@/components/ui/heading";
import ProfileStat from "@/components/ProfileStat";
import { Divider } from "@/components/ui/divider";
import Achievement from "@/components/AchievementIcon";
import { useUserContext } from "@/context/UserProvider";

export default function Profile() {
  const user: User = {
    id: "100",
    email: "angel@g.com",
    firstName: "angel",
    lastName: "cambarijan",
  };

  // const { user } = useUserContext();
  const { logout } = useAuthContext();

  return (
    <View>
      <ScrollView className="pb-5">
        <View className="bg-background-lightGrayOrange w-full h-32 drop-shadow-lg"></View>

        <View className="flex">
          <View className="px-8 pt-6 pb-3 w-full">
            <Image
              source={require("@/assets/images/leeseopp.png")}
              className="rounded-full border-[5px] border-white w-32 h-32 -mt-20 z-10"
              size="lg"
              alt="User profile pic"
            />

            <View className="flex-row justify-between">
              <View className="pb-5">
                <View className="flex-row">
                  <Heading>
                    {user?.id}
                    {user?.firstName} {user?.lastName}
                  </Heading>
                </View>
                <Text>@UsernameUnta</Text>
              </View>
              <Button //mogana rani man
                onPress={async () => {
                  router.push("profile/profileSettings");
                }}
              >
                <Text>test</Text>
              </Button>
              <Image
                source={require("@/assets/icons/settings_icon.png")}
                alt="settings icon"
                className="w-15 h-15"
              />

              <View>
                <Text className="text-lg font-bold">321</Text>
                <Text className="text-sm text-gray-700">
                  Reading Compr. Level
                </Text>
              </View>
            </View>

            <Heading>Overview</Heading>

            <View className="flex-wrap flex-row justify-between py-5">
              <ProfileStat level={3} description="Longest Streak" />
              <ProfileStat level={10} description="Books Read" />
              <ProfileStat level={4.5} description="Hours Avg. Screentime" />
              <ProfileStat level={2} description="Achievements" />
            </View>

            <View className="flex-row justify-between">
              <Heading className="pb-5">Achievements</Heading>
              <Text // idk how to arrange sa screens sorry :((
                underline
                onPress={async () => {
                  router.push("profile/achievements");
                }}
              >
                View All
              </Text>
            </View>

            <View className="flex-row flex">
              <View>
                <Achievement />
              </View>
              <View>
                <Achievement />
              </View>
              <View>
                <Achievement />
              </View>
            </View>
          </View>

          <Button>
            <ButtonText
              onPress={async () => {
                await logout();
                router.push("/");
              }}
            >
              LogOut
            </ButtonText>
          </Button>
          <View className="p-3 justify-center items-center w-full"></View>
        </View>
      </ScrollView>
    </View>
  );
}
