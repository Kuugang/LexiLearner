import { Button } from "@/components/ui/button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";

export default function BackHeader() {
  return (
    <Button
      className="bg-transparent self-start p-0"
      onPress={() => router.back()}
    >
      <FontAwesomeIcon size={30} icon={faArrowLeft} />
    </Button>
  );
}
