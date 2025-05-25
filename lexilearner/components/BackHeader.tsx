import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function BackHeader({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity
      className="bg-transparent self-start p-0 my-1"
      onPress={() => {
        onPress?.();
        router.back();
      }}
    >
      <FontAwesomeIcon size={30} icon={faArrowLeft} />
    </TouchableOpacity>
  );
}
