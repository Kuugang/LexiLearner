import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function BackHeader() {
  return (
    <TouchableOpacity
      className="bg-transparent self-start p-0"
      onPress={() => router.back()}
    >
      <FontAwesomeIcon size={30} icon={faArrowLeft} />
    </TouchableOpacity>
  );
}
