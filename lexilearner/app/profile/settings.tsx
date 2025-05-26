import { router } from "expo-router";
import { useEffect, useState } from "react";
import { checkUserExist } from "@/services/UserService";
import {
  getChangedFields,
  getFormDataImageFromPickerAsset,
  validateField,
} from "@/utils/utils";
import { useUserStore } from "@/stores/userStore";
import { useGlobalStore } from "@/stores/globalStore";
import { useAuthStore } from "@/stores/authStore";
import * as ImagePicker from "expo-image-picker";

//Components
import { View, ScrollView, Image, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/Modal";
import BackHeader from "@/components/BackHeader";
import Toast from "react-native-toast-message";
import { User } from "@/models/User";
import { API_URL } from "@/utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState<boolean>(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const deleteAccount = useUserStore((state) => state.deleteAccount);

  const logout = useAuthStore((state) => state.logout);

  const user = useUserStore((state) => state.user);

  const [profile, setProfile] = useState<User>(
    user ? { ...user } : ({} as User)
  );

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({ ...user });
    }
  }, [user]);

  useEffect(() => {
    if (JSON.stringify(user) === JSON.stringify(profile)) {
      setIsProfileChanged(false);
      return;
    }
    setIsProfileChanged(true);
  }, [profile]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const newErrors: any = {};
      Object.keys(profile).forEach((field) => {
        const error = validateField(field, profile[field], profile);
        if (error === "") return;
        newErrors[field] = error;
      });

      if (
        profile.userName !== user?.userName &&
        (await checkUserExist("username", profile.userName)).statusCode === 200
      ) {
        newErrors["username"] = "Username is already taken";
      }

      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;

      const changes = getChangedFields(user, profile);
      if (Object.keys(changes).length > 0) {
        if (changes.avatar) {
          changes.avatar = avatarFile;
        }
        await updateProfile(changes);
      } else {
        console.log("No changes to update");
      }

      Toast.show({
        type: "success",
        text1: "Profile Updated",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Update Profile Failed",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteAccount();

      Toast.show({
        type: "success",
        text1: "Goodbye for now 👋",
        text2: "Your account has been deleted. We're sad to see you go!",
      });
      setDeleteAccountModalVisible(false);

      router.replace("/");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Delete Account Failed",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.dismissAll();
    router.replace("/");
  };

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (!result.canceled) {
        const image = await getFormDataImageFromPickerAsset(result.assets[0]);
        setAvatarFile(image);
        setProfile({ ...profile, avatar: image.uri });
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="bg-background p-8">
        <BackHeader />

        <View className="justify-around">
          <View className="flex items-center justify-center gap-4">
            <Pressable onPress={openImagePicker}>
              <Image
                source={
                  avatarFile
                    ? {
                        uri: avatarFile.uri,
                      }
                    : user?.avatar
                    ? {
                        uri: `${API_URL.replace(
                          /\/api\/?$/,
                          "/"
                        )}${user.avatar.replace(/^\/+/, "")}`,
                      }
                    : require("@/assets/images/default_pfp.png")
                }
                className="rounded-full w-32 h-32"
                alt="User profile pic"
              />
            </Pressable>

            <Text className="text-2xl font-bold m-4 mb-6">Profile</Text>
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
            <Text className="font-bold">Last Name</Text>
            <Input
              placeholder={profile.lastName}
              value={profile.lastName}
              onChangeText={(value: string) =>
                setProfile({ ...profile, lastName: value })
              }
            />
          </View>

          <View className="py-1">
            <Text className="font-bold">Username</Text>

            <Input
              placeholder={profile.userName}
              value={profile.userName}
              onChangeText={(value: string) =>
                setProfile({ ...profile, userName: value })
              }
            />
            {formErrors.username && (
              <Text className="text-destructive">{formErrors.username}</Text>
            )}
          </View>

          <View className="py-1">
            <Text className="font-bold">Email</Text>

            <Input
              editable={false}
              placeholder={user?.email}
              value={user?.email}
            ></Input>
          </View>

          <View className="py-1">
            <Text className="font-bold">Password</Text>
            <Input placeholder="******"></Input>
          </View>
          <View className="m-5"></View>
          {isProfileChanged && (
            <Button
              variant="dropshadow"
              size={null}
              onPress={() => handleUpdateProfile()}
              className="my-2 bg-yellowOrange"
            >
              <Text>Confirm Edit</Text>
            </Button>
          )}

          <Button
            variant="dropshadow"
            size={null}
            onPress={() => setDeleteAccountModalVisible(true)}
            className="bg-orange"
          >
            <Text className="font-bold text-white">Delete Account</Text>
          </Button>

          <Button
            variant="dropshadow"
            size={null}
            onPress={() => setLogoutModalVisible(true)}
            className="bg-yellowOrange mb-16"
          >
            <Text className="font-bold">Log Out</Text>
          </Button>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={deleteAccountModalVisible}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteAccountModalVisible(false)}
        icon="close"
        highlightedText="permanently"
      />

      <ConfirmModal
        visible={logoutModalVisible}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
        icon="logout"
        highlightedText=""
      />
    </SafeAreaView>
  );
}
