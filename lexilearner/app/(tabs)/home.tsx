import { Text } from "@/components/ui/text";
import { Platform, ScrollView } from "react-native";
import { useAuthContext } from "@/context/AuthProvider";

const HEADER = 200; // Assuming value, adjust as needed
const navbar = 80; // Assuming value, adjust as needed
const margin = 16; // Assuming value, adjust as needed
const dark = false; // Assuming value, adjust as needed
const ios = Platform.OS === "ios";
const colors = {
  background: "#FFFFFF", // Assuming value, adjust as needed
};
import { useAuth } from "@/stores/authStore";

interface HomeScreenProps {}

export default function HomeScreen({}: HomeScreenProps): JSX.Element {
  const { user } = useAuth();

  const getGreeting = (): string => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning " + user?.firstName + " " + user?.lastName;
    }
    if (hours >= 12 && hours <= 17) {
      return "Good Afternoon " + user?.firstName + " " + user?.lastName;
    }
    return "Good Evening " + user?.firstName + " " + user?.lastName;
  };

  return (
    <ScrollView>
      <Text>{getGreeting()}</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>HomeView</Text>
      <Text>What</Text>
    </ScrollView>
  );
}
