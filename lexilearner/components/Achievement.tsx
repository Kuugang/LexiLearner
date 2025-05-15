import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View } from "react-native";

interface AchievementProp {
    title: string;
    description: string;
}

export default function Achievement({ title, description }: AchievementProp) {
    return (
        <View className="p-5 mb-4 w-full bg-lightBlue rounded-xl shadow-main">
            <Text className="font-bold text-lg">{title}</Text>
            <Text className="text-sm" numberOfLines={1} adjustsFontSizeToFit>
                {description}
            </Text>
        </View>
    );
}
