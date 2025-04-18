import React, { useContext, useState } from "react";

import { RegisterFormContext } from "../../app/(auth)/_layout";
import { useAuthStore } from "@/stores/authStore";

//Components
import { TouchableOpacity, View, ScrollView } from "react-native";
import { Eye, EyeOff, Mail, KeyRound, UserRound } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import BackHeader from "../BackHeader";

interface SignUp1Props {
  formErrors: Record<string, any>;
  handleStep: () => void;
}

export default function SignUp1({ formErrors, handleStep }: SignUp1Props) {
  const { registerForm, setRegisterForm } = useContext(RegisterFormContext);
  const providerAuth = useAuthStore((state) => state.providerAuth);

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <ScrollView className="bg-yellowOrange">
      <View className="flex-1 gap-12 p-8 h-full justify-around">
        <BackHeader />

        <View className="flex flex-col gap-4">
          <Text className="font-bold text-2xl">Let's Get Started!</Text>

          <View className="flex gap-2">
            <View className="relative">
              <UserRound
                size={20}
                color="#888"
                style={{
                  position: "absolute",
                  left: 10,
                  top: 12,
                  zIndex: 1,
                }}
              />
              <Input
                className="pl-10 py-2 rounded-xl shadow-xl"
                placeholder="Username"
                value={registerForm.username}
                onChangeText={(value: string) =>
                  setRegisterForm({ ...registerForm, username: value })
                }
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
              />
            </View>
            {formErrors.username && (
              <Text className="text-destructive">{formErrors.username}</Text>
            )}
          </View>

          {/* Email Field */}
          <View className="flex gap-2">
            <View className="relative">
              <Mail
                size={20}
                color="#888"
                style={{
                  position: "absolute",
                  left: 10,
                  top: 12,
                  zIndex: 1,
                }}
              />
              <Input
                className="pl-10 py-2 rounded-xl shadow-xl"
                placeholder="Email"
                value={registerForm.email}
                onChangeText={(value: string) =>
                  setRegisterForm({ ...registerForm, email: value })
                }
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
              />
            </View>
            {formErrors.email && (
              <Text className="text-destructive">{formErrors.email}</Text>
            )}
          </View>

          <View className="flex gap-2">
            <View>
              <View className="relative">
                <KeyRound
                  size={20}
                  color="#888"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 12,
                    zIndex: 1,
                  }}
                />

                <Input
                  className="pl-10 py-2 rounded-xl shadow-xl"
                  placeholder="Password"
                  value={registerForm.password}
                  secureTextEntry={showPassword ? false : true}
                  onChangeText={(value: string) =>
                    setRegisterForm({ ...registerForm, password: value })
                  }
                  aria-labelledby="inputLabel"
                  aria-errormessage="inputError"
                />
              </View>

              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff size={20} color="#888" />
                ) : (
                  <Eye size={20} color="#888" />
                )}
              </TouchableOpacity>
            </View>
            {formErrors.password && (
              <Text className="text-destructive">{formErrors.password}</Text>
            )}
          </View>

          <View className="flex gap-2">
            <View>
              <View className="relative">
                <KeyRound
                  size={20}
                  color="#888"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 12,
                    zIndex: 1,
                  }}
                />

                <Input
                  className="pl-10 py-2 rounded-xl shadow-xl"
                  placeholder="Password"
                  value={registerForm.confirmPassword}
                  secureTextEntry={showPassword ? false : true}
                  onChangeText={(value: string) =>
                    setRegisterForm({ ...registerForm, confirmPassword: value })
                  }
                  aria-labelledby="inputLabel"
                  aria-errormessage="inputError"
                />
              </View>

              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff size={20} color="#888" />
                ) : (
                  <Eye size={20} color="#888" />
                )}
              </TouchableOpacity>
            </View>
            {formErrors.confirmPassword && (
              <Text className="text-destructive">
                {formErrors.confirmPassword}
              </Text>
            )}
          </View>
        </View>

        <View>
          <Button
            className="bg-orange rounded-lg"
            onPress={() => {
              handleStep();
            }}
          >
            <Text className="text-white text-2xl font-bold">Sign Up</Text>
          </Button>

          <View className="flex gap-3">
            <View className="w-full flex flex-row items-center gap-2 mt-4">
              <View className="flex-1 h-px bg-black" />
              <Text className="text-primary-0 mx-2 text-sm">
                OR CONTINUE WITH
              </Text>
              <View className="flex-1 h-px bg-black" />
            </View>

            <View className="flex flex-row gap-3 w-full justify-center items-center">
              <Button
                className="bg-white shadow-md rounded-lg"
                onPress={() => {
                  providerAuth(0);
                }}
              >
                <FontAwesomeIcon icon={faGoogle} />
              </Button>

              <Button
                className="bg-white shadow-md rounded-lg"
                onPress={() => {
                  providerAuth(1);
                }}
              >
                <FontAwesomeIcon icon={faFacebook} />
              </Button>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
