import { Text } from "@/components/ui/text";
import { View } from "react-native";
import SvgUri from "react-native-svg-uri";

function extractDriveFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] || match[2] : null;
}

export default function AchievementDisplay({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge: string;
}) {
  const fileId = extractDriveFileId(badge);
  const svgUrl = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
    : undefined;

  return (
    <View className="p-5 mb-4 w-full bg-lightBlue rounded-xl shadow-main">
      {svgUrl && <SvgUri width="24" height="24" source={{ uri: svgUrl }} />}
      <Text className="font-bold text-lg">{title}</Text>
      <Text className="text-sm" numberOfLines={1} adjustsFontSizeToFit>
        {description}
      </Text>
    </View>
  );
}
