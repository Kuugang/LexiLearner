import { ScrollView } from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import SignUp4 from "@/components/Auth/SignUp4";
import { useUserContext } from "@/context/UserProvider";

export default function Step4() {
  const { updateProfile } = useUserContext();
  const { setIsLoading } = useGlobalContext();

  const [age, setAge] = useState(null);
  const [ageInvalid, setAgeInvalid] = useState(false);

  const handleStep = async () => {
    try {
      if (age === null) {
        setAgeInvalid(true);
        return;
      }
      setAgeInvalid(false);
      setIsLoading(true);
      await updateProfile({ age: age });
      router.replace("/home");
      //TODO TOAST
    } catch (error: any) {
      console.error(error);
      //TODO: TOASt
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="bg-background-yellowOrange">
      <SignUp4
        ageInvalid={ageInvalid}
        setAge={setAge}
        handleStep={handleStep}
      />
    </ScrollView>
  );
}
