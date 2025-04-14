import React from "react";

//Components
import { Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

interface SignUp4Props {
  ageInvalid: boolean;
  setAge: (value: string | null) => void;
  handleStep: () => void;
}

export default function SignUp4({
  ageInvalid,
  setAge,
  handleStep,
}: SignUp4Props) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      android: insets.bottom,
      default: insets.bottom,
    }),
    left: 12,
    right: 12,
  };

  return (
    <View className="flex-1 gap-14 p-8 h-full justify-around items-center">
      <View className="flex-1 gap-6 p-8 h-full justify-around items-center">
        <Image
          source={require("@/assets/images/role-pupil.png")}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
          alt=""
        />
        <Text className="text-typography-black font-bold text-3xl">
          Almost There!
        </Text>
      </View>

      <Select
        onValueChange={(e) => {
          setAge(e?.value as string);
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue
            className="text-foreground text-sm native:text-lg"
            placeholder="Enter your age"
          />
        </SelectTrigger>

        <SelectContent insets={contentInsets} side="bottom">
          <ScrollView className="w-[245px] max-h-64">
            <SelectLabel>Age</SelectLabel>
            {[
              6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
            ].map((value) => (
              <SelectItem
                key={value}
                label={String(value)}
                value={String(value)}
              >
                {value}
              </SelectItem>
            ))}
          </ScrollView>
        </SelectContent>
      </Select>

      {ageInvalid && (
        <Text className="text-lg text-destructive text-center">
          Please enter your age.
        </Text>
      )}

      <Button
        className="bg-primary rounded-lg w-full"
        onPress={() => {
          handleStep();
        }}
      >
        <Text className="text-primary-foreground">Finish</Text>
      </Button>
    </View>
  );
}
