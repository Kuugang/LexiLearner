import React, { useContext, useState } from "react";
import { router } from "expo-router";

import { RegisterFormContext } from "../../app/(auth)/_layout";
import { useAuthContext } from "@/context/AuthProvider";

//Components
import { View } from "react-native";
import { Eye, EyeOff, Mail, KeyRound, UserRound } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Separator } from "~/components/ui/separator";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface SignUp1Props {
  formErrors: Record<string, any>;
  handleStep: () => void;
}

export default function SignUp1({ formErrors, handleStep }: SignUp1Props) {
  const { registerForm, setRegisterForm } = useContext(RegisterFormContext);
  const { providerAuth } = useAuthContext();

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <>
      <View className="flex-1 gap-36 p-8 h-full justify-around">
        <Button
          className="bg-transparent self-start p-0"
          onPress={() => router.back()}
        >
          <FontAwesomeIcon size={30} icon={faArrowLeft} />
        </Button>

        <View>
          <Text className="text-primary-0 text-2xl">Let's Get Started!</Text>

          {/* Username Field */}
          <View className="flex gap-2">
            <View className="relative">
              <UserRound className="absolute left-2 top-2" />
              <Input
                className="p-10"
                placeholder="Username"
                value={registerForm.username}
                onChangeText={(value: string) =>
                  setRegisterForm({ ...registerForm, username: value })
                }
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
              />
            </View>
            <Text className="text-destructive">{formErrors.username}</Text>
          </View>

          {/* Email Field */}
          <View className="flex gap-2">
            <View className="relative">
              <Mail className="absolute left-2 top-2" />
              <Input
                className="p-10"
                placeholder="Email"
                value={registerForm.email}
                onChangeText={(value: string) =>
                  setRegisterForm({ ...registerForm, email: value })
                }
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
              />
            </View>
            <Text className="text-destructive">{formErrors.email}</Text>
          </View>

          <View className="flex gap-2">
            <View>
              <View className="relative">
                <KeyRound className="absolute left-2 top-2" />

                <Input
                  className="p-10"
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

              <Button
                variant="ghost"
                size="icon"
                onPress={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </View>
            <Text className="text-destructive">{formErrors.password}</Text>
          </View>

          <View className="flex gap-2">
            <View>
              <View className="relative">
                <KeyRound className="absolute left-2 top-2" />

                <Input
                  className="p-10"
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

              <Button
                variant="ghost"
                size="icon"
                onPress={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </View>
            <Text className="text-destructive">
              {formErrors.confirmPassword}
            </Text>
          </View>
        </View>

        <View>
          <Button
            className="bg-primary"
            onPress={() => {
              handleStep();
            }}
          >
            <Text className="text-primary-foreground">Sign Up</Text>
          </Button>

          <View className="flex gap-3">
            <View className="w-full justify-center items-center mt-4">
              <Separator />
              <Text className="text-primary-0">OR CONTINUE WITH</Text>
              <Separator />
            </View>

            <View className="flex flex-row gap-3 w-full justify-center items-center">
              <Button
                className="bg-backgruond shadow-md rounded-lg"
                onPress={() => {
                  providerAuth(0);
                }}
              >
                <FontAwesomeIcon icon={faGoogle} />
              </Button>

              <Button
                className="bg-card shadow-md rounded-lg"
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
    </>
  );
}
