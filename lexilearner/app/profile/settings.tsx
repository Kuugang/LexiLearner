import { useUserContext } from "@/context/UserProvider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { checkUserExist, deleteAccount } from "@/services/UserService";
import { validateField } from "@/utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Components
import { Alert, View, ScrollView, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import BackHeader from "@/components/BackHeader";
import { AuthContext, useAuthContext } from "@/context/AuthProvider";
import { StackActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function Settings() {
  const { setIsLoading } = useGlobalContext();
  const { user, updateProfile } = useUserContext();
  const { logout } = useAuthContext();
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    username: user?.userName,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });

  useEffect(() => {
    if (
      profile.firstName === user?.firstName &&
      profile.lastName === user?.lastName &&
      profile.username === user?.userName
    ) {
      setIsProfileChanged(false);
      return;
    }
    setIsProfileChanged(true);
  }, [profile]);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const newErrors: any = {};
      Object.keys(profile).forEach((field) => {
        const error = validateField(field, profile[field], profile);
        if (error === "") return;
        newErrors[field] = error;
      });
      setFormErrors(newErrors);

      if (
        (await checkUserExist("username", profile.username as string))
          .statusCode == 200 &&
        profile.username !== user?.userName
      ) {
        setFormErrors({ ...formErrors, username: "Username is already taken" });
      }
      if (Object.keys(newErrors).length > 0) return;

      await updateProfile(profile);
      Toast.show({
        type: "success",
        text1: "Profile Updated",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      await AsyncStorage.removeItem("token");
      router.push("/");
    } catch (err) {
      Alert.alert("Error deleting account");
    }
  };

  return (
    <ScrollView className="bg-background p-8">
      <BackHeader />

      <View space="xl" className="justify-around">
        <View className="flex items-center justify-center gap-4">
          <Image
            source={require("@/assets/images/leeseopp.png")}
            className="rounded-full border-4 w-32 h-32"
            alt="User profile pic"
          />

          <Text className="text-2xl font-bold">Profile</Text>
        </View>

        <View className="py-1">
          <Text className="font-bold">First Name</Text>
          <Input
            placeholder={profile.firstName}
            value={profile.firstName}
            onChangeText={(value: string) =>
              setProfile({ ...profile, firstName: value })
            }
          ></Input>
          {formErrors.firstName && (
            <Text className="text-destructive">{formErrors.firstName}</Text>
          )}
        </View>

        <View className="py-1">
          <Text>Last Name</Text>
          <Input
            placeholder={profile.lastName}
            value={profile.lastName}
            onChangeText={(value: string) =>
              setProfile({ ...profile, lastName: value })
            }
          ></Input>
        </View>

        <View className="py-1">
          <Text>Username</Text>

          <Input
            placeholder={profile.username}
            value={profile.username}
            onChangeText={(value: string) =>
              setProfile({ ...profile, username: value })
            }
          ></Input>
        </View>

        <View className="py-5">
          <Text>Password</Text>
          <Input placeholder="******"></Input>
        </View>

        {isProfileChanged && (
          <Button onPress={() => handleUpdateProfile()} className="my-2">
            <Text>EDIT ACCOUNT</Text>
          </Button>
        )}

        {/* <Button onPress={() => handleDeleteAccount()} className="my-2"> */}
        {/*   <Text>DELETE ACCOUNT</Text> */}
        {/* </Button> */}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Text className="text-destructive">Delete Account</Text>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-center">
              <Button onPress={() => handleDeleteAccount()}>
                <Text className="text-destructive">Yes</Text>
              </Button>
              <DialogClose asChild>
                <Button>
                  <Text>No</Text>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          onPress={() => {
            logout();
            router.dismissAll();
            router.replace("/");
          }}
          className="my-2"
        >
          <Text>LOG OUT</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
