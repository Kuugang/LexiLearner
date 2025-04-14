import { useState } from "react";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useUserContext } from "@/context/UserProvider";

import { ScrollView } from "react-native";
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
    <ScrollView className="bg-background">
      <SignUp4
        ageInvalid={ageInvalid}
        setAge={setAge}
        handleStep={handleStep}
      />
    </ScrollView>
  );
}
