import React, { useContext } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { RegisterFormContext } from "@/app/(auth)/_layout";

//Components
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface SignUp3Props {
  isInvalid: boolean;
  handleStep: () => void;
}

export default function SignUp3({ isInvalid, handleStep }: SignUp3Props) {
  const { fromProviderAuth } = useLocalSearchParams();
  const {
    registerForm,
    setRegisterForm,
    providerRegisterForm,
    setProviderRegisterForm,
  } = useContext(RegisterFormContext);

  return (
    <>
      <View className="flex-1 gap-2 p-8 h-full justify-around">
        <Button
          className="bg-transparent self-start p-0"
          onPress={() => router.back()}
        >
          <FontAwesomeIcon size={30} icon={faArrowLeft} />
        </Button>

        <RadioGroup
          value={
            fromProviderAuth ? providerRegisterForm.role : registerForm.role
          }
          onValueChange={(selected) => {
            if (fromProviderAuth) {
              setProviderRegisterForm({
                ...providerRegisterForm,
                role: selected,
              });
            } else {
              setRegisterForm({ ...registerForm, role: selected });
            }
          }}
          className="gap-3"
        >
          <View className="flex items-center gap-8">
            <RadioGroupItem
              aria-labelledby={`label-for-teacher`}
              value={"Teacher"}
              style={{ display: "none" }}
            />
            <Label
              className="flex flex-col gap-4 items-center justify-center"
              nativeID={`label-for-teacher`}
              onPress={() => {
                if (fromProviderAuth) {
                  setProviderRegisterForm({
                    ...providerRegisterForm,
                    role: "Teacher",
                  });
                } else {
                  setRegisterForm({ ...registerForm, role: "Teacher" });
                }
              }}
            >
              <View
                className={`h-60 w-60 p-2 rounded-full ${registerForm.role == "Teacher" ? "bg-orange-500 scale-105" : ""}}`}
              >
                <Image
                  source={require("@/assets/images/role-teacher.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="contain"
                  alt=""
                />
              </View>
              <Text className="text-xl font-bold">Teacher</Text>
            </Label>

            <View>
              <Text className="text-4xl font-bold">Are you?</Text>
            </View>

            <RadioGroupItem
              aria-labelledby={`label-for-pupil`}
              value={"Pupil"}
              style={{ display: "none" }}
            />
            <Label
              className="flex flex-col gap-4 items-center justify-center"
              nativeID={`label-for-pupil`}
              onPress={() => {
                if (fromProviderAuth) {
                  setProviderRegisterForm({
                    ...providerRegisterForm,
                    role: "Pupil",
                  });
                } else {
                  setRegisterForm({ ...registerForm, role: "Pupil" });
                }
              }}
            >
              <View
                className={`h-60 w-60 p-2 rounded-full ${registerForm.role == "Pupil" ? "bg-orange-500 scale-105" : ""}}`}
              >
                <Image
                  source={require("@/assets/images/role-pupil.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                  alt=""
                />
              </View>
              <Text className="text-xl font-bold">Pupil</Text>
            </Label>
          </View>
        </RadioGroup>
        {isInvalid && (
          <Text className="text-lg text-destructive text-center">
            Please select a role
          </Text>
        )}

        <Button
          className="bg-primary rounded-lg"
          onPress={() => {
            handleStep();
          }}
        >
          <Text className="text-white">Continue</Text>
        </Button>
      </View>
    </>
  );
}
