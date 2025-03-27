import { View } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import { useGlobalContext } from "@/context/GlobalProvider";

const SpinnerOverlay = () => {
  const { isLoading } = useGlobalContext();
  if (!isLoading) return null;

  return (
    <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <Spinner size="small" color={colors.gray[500]} />
    </View>
  );
};

export default SpinnerOverlay;
