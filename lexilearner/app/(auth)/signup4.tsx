import { ScrollView } from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import { updateProfile } from "@/services/UserService";
import { useGlobalContext } from "@/context/GlobalProvider";

import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import SignUp4 from "@/components/Auth/SignUp4";

export default function Step4() {
  const toast = useToast();
  const { setIsLoading } = useGlobalContext();

  const [ageInvalid, setAgeInvalid] = useState(false);
  const [gradeLevelInvalid, setGradeLevelInvalid] = useState(false);

  const [form, setForm] = useState({
    age: "",
    gradeLevel: "",
  });

  const handleStep = async () => {
    setAgeInvalid(!form.age.trim());
    setGradeLevelInvalid(!form.gradeLevel.trim());

    if (form.age?.trim() && form.gradeLevel?.trim()) {
      setIsLoading(true);
      try {
        await updateProfile(form);
        router.replace("/home");
      } catch (error: any) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const toastId = "toast-" + id;
            const errorMessage =
              error instanceof Error ? error.message : "An error occurred";

            return (
              <Toast
                nativeID={toastId}
                className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row bg-red-500 rounded-lg"
              >
                <ToastTitle size="sm">{errorMessage}</ToastTitle>
              </Toast>
            );
          },
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <SignUp4
        ageInvalid={ageInvalid}
        gradeLevelInvalid={gradeLevelInvalid}
        form={form}
        setForm={setForm}
        handleStep={handleStep}
      />
    </ScrollView>
  );
}
