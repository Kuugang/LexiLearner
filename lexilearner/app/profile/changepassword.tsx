import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/stores/globalStore";
import { validateField } from "@/utils/utils";
import { useState } from "react";
import React from "react";
import Toast from "react-native-toast-message";
import BackHeader from "@/components/BackHeader";
import { Eye, EyeOff, KeyRound } from "lucide-react-native";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/userStore";
import { router } from "expo-router";
import LoadingScreenForm from "@/components/LoadingScreenForm";

export default function ChangePassword() {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const isLoading = useGlobalStore((state) => state.isLoading);
  // Add local state for form and formErrors
  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const updateProfile = useUserStore((state) => state.updateProfile);

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      const newErrors: any = {};
      Object.keys(form).forEach((field) => {
        const error = validateField(field, form[field], form);
        if (error === "") return;
        newErrors[field] = error;
      });

      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;

      await updateProfile(form);
      Toast.show({
        type: "success",
        text1: "Password Changed",
      });

      router.back();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Change Password Failed",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScrollView className="bg-white">
        <View className="flex-1 gap-10 p-8 h-full justify-around">
          <BackHeader />
          <Text className="font-black text-2xl">Change your password</Text>
          <View className="flex gap-3 justify-around">
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
                    placeholder="Current Password"
                    value={form.currentPassword}
                    secureTextEntry={showCurrentPassword ? false : true}
                    onChangeText={(value: string) =>
                      setForm({ ...form, currentPassword: value })
                    }
                    aria-labelledby="inputLabel"
                    aria-errormessage="inputError"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} color="#888" />
                  ) : (
                    <Eye size={20} color="#888" />
                  )}
                </TouchableOpacity>
              </View>
              {formErrors.currentPassword && (
                <Text className="text-destructive">
                  {formErrors.currentPassword}
                </Text>
              )}
            </View>
          </View>

          <View className="flex gap-3 justify-around">
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
                    placeholder="New Password"
                    value={form.password}
                    secureTextEntry={showNewPassword ? false : true}
                    onChangeText={(value: string) =>
                      setForm({ ...form, password: value })
                    }
                    aria-labelledby="inputLabel"
                    aria-errormessage="inputError"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
                >
                  {showNewPassword ? (
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

          <View className="flex gap-3 justify-around">
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
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    secureTextEntry={showConfirmPassword ? false : true}
                    onChangeText={(value: string) =>
                      setForm({ ...form, confirmPassword: value })
                    }
                    aria-labelledby="inputLabel"
                    aria-errormessage="inputError"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
                >
                  {showConfirmPassword ? (
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

          <Button
            variant="dropshadow"
            size={null}
            onPress={() => handleChangePassword()}
            className="my-2 bg-yellowOrange"
          >
            <Text>Save</Text>
          </Button>
        </View>
      </ScrollView>

      <LoadingScreenForm visible={isLoading} />
    </>
  );
}
