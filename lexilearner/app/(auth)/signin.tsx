import React, { useState } from "react";
import Toast from "react-native-toast-message";
import { useGlobalStore } from "~/stores/globalStore";
import { router } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { validateField } from "@/utils/utils";
import { getProfile } from "@/services/UserService";
import { login as apiLogin } from "@/services/AuthService";
import { extractUser } from "@/models/User";
import { useUserStore } from "@/stores/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Components
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Eye, EyeOff, Mail, KeyRound } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import BackHeader from "@/components/BackHeader";

const SignIn = () => {
  const setUser = useUserStore.getState().setUser;
  const providerAuth = useAuthStore((state) => state.providerAuth);
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "mrekajojab@gmail.com",
    password: "Maotka1!",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const newErrors: any = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field as keyof typeof form]);
      if (error == "") return;
      newErrors[field] = error;
    });

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      let response = await apiLogin(form.email, form.password);
      await AsyncStorage.setItem("accessToken", response.data.accessToken);
      await AsyncStorage.setItem(
        "refreshToken",
        response.data.refreshToken.token,
      );

      response = await getProfile();

      const userData = response.data;

      if (userData) {
        const user = extractUser(response.data);
        setUser(user);
        Toast.show({
          type: "success",
          text1: "Authentication Success",
        });
        router.replace("/home");
      } else {
        router.push({
          pathname: "/signup3",
          params: { fromProviderAuth: "false" },
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Authentication Failed",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="bg-yellowOrange">
      <View className="flex-1 gap-36 p-8 h-full justify-around">
        <BackHeader />

        <View className="flex gap-3 justify-around">
          <Text className="font-black text-2xl">Welcome Back!</Text>

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
                value={form.email}
                onChangeText={(value: string) =>
                  setForm({ ...form, email: value })
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
                  value={form.password}
                  secureTextEntry={showPassword ? false : true}
                  onChangeText={(value: string) =>
                    setForm({ ...form, password: value })
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
        </View>

        <View>
          <TouchableOpacity
            className="bg-orange border border-dropShadowColor rounded-xl border-b-4 p-3 items-center"
            onPress={() => {
              handleLogin();
            }}
          >
            <Text className="text-white text-md font-bold">Log In</Text>
          </TouchableOpacity>

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
};

export default React.memo(SignIn);
