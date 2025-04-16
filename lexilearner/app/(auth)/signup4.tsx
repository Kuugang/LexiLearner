import { useState } from "react";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useUserContext } from "@/context/UserProvider";
import Toast from "react-native-toast-message";

import SignUp4 from "@/components/Auth/SignUp4";

export default function Step4() {
  const { updateProfile } = useUserContext();
  const { setIsLoading } = useGlobalContext();

  const [age, setAge] = useState<string | null>(null);
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
      Toast.show({
        type: "success",
        text1: "Registration Success",
      });
      router.replace("/home");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUp4 ageInvalid={ageInvalid} setAge={setAge} handleStep={handleStep} />
  );
}
