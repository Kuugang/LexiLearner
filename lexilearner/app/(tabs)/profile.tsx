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
import Achievement from "@/components/Achievement";

export default function Profile() {
  const user: User = {
    id: "100",
    email: "angel@g.com",
    firstName: "angel",
    lastName: "cambarijan",
  };

  const { logout } = useAuthContext();

  return (
    <View>
      <ScrollView className="pb-5">
        <View className="bg-background-lightGrayOrange w-full h-32 drop-shadow-lg"></View>

        <View className="justify-center items-center flex">
          <Image
            source={require("@/assets/images/leeseopp.png")}
            className="rounded-full border-[5px] border-white w-32 h-32 -mt-16 z-10"
            size="lg"
            alt="User profile pic"
          />
          <View className="p-2 items-center">
            <View className="flex-row">
              <Heading>UsernameUnta</Heading>
              <Image
                source={require("@/assets/icons/mdi_pencil.png")}
                className="w-15 h-15 px-10"
                alt="Profile pencil edit"
              />
            </View>
            <Text>
              {user.firstName} {user.lastName}
            </Text>
          </View>

          <View className="px-8 pt-6 pb-3 w-full">
            <View className="flex-row flex-wrap justify-between">
              <View className="w-1/3 items-center">
                <ProfileStat level={12} description="Longest Streak" />
              </View>
              <View className="w-1/3 items-center">
                <ProfileStat level={321} description="Reading Compr. Level" />
              </View>
              <View className="w-1/3 items-center">
                <ProfileStat level={10} description="Books Read" />
              </View>
            </View>
          </View>

          <Divider className="bg-black h-[1px] w-full my-4 p-0" />

          <View className="px-8 py-3 items-start w-full">
            <Heading className="pb-5">Achievements</Heading>
            <View>
              <Achievement
                title="Reader Rookie"
                description="Read a total of 3 books."
              />
            </View>
            <View>
              <Achievement
                title="More and More!"
                description="Reach 300 Reading Comprehension Level."
              />
            </View>
            <View>
              <Achievement
                title="huwaw"
                description="paramore playing rn frfr lorem ipsum aint it good "
              />
            </View>
            <View className="p-3 justify-center items-center w-full">
              <Text underline>View All</Text>
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
        </View>
      </ScrollView>
    </View>
  );
}
