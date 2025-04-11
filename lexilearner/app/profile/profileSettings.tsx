import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Alert, View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { useUserContext } from "@/context/UserProvider";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import BackHeader from "@/components/BackHeader";
import { deleteAccount } from "@/services/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function profileSettings() {
  const { user, updateProfile } = useUserContext();

  const [profile, setNewProfile] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    // username: "",
    email: user?.email,
  });

  const handleInputChange = (field: string, value: string) => {
    //string lng sa ??
    setNewProfile((prevState) => ({
      ...prevState,
      [field]: value,
    }));
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
    <View>
      {/* <View className="z-10 absolute top-0 w-full h-64 bg-background-lightGrayOrange"></View> */}

      <BackHeader />

      <View className="p-10">
        <Heading>Profile</Heading>

        <Text>First Name</Text>
        <Input>
          <InputField
            placeholder={profile.firstName}
            value={profile.firstName}
            onChangeText={(value) => handleInputChange("firstName", value)}
          />
        </Input>

        <Text>Last Name</Text>
        <Input>
          <InputField
            placeholder={profile.lastName}
            value={profile.lastName}
            onChangeText={(value) => handleInputChange("lastName", value)}
          />
        </Input>

        <Text>Username</Text>
        <Input>
          <InputField placeholder="Leeseo" />
        </Input>

        <Text>Email</Text>
        <Input>
          <InputField
            placeholder={profile.email}
            value={profile.email}
            onChangeText={(value) => handleInputChange("email", value)}
          />
        </Input>

        <Text>Password</Text>
        <Input>
          <InputField placeholder="*****" />
        </Input>

        <Button
          onPress={() => {
            updateProfile(profile);
            console.log("update profile test", profile);
          }}
        >
          <ButtonText>EDIT ACCOUNT</ButtonText>
        </Button>

        <Button
          onPress={() => {
            handleDeleteAccount();
            console.log("delete account unta", user);
          }}
        >
          <ButtonText>DELETE ACCOUNT</ButtonText>
        </Button>
      </View>
    </View>
  );
}
