import { Text } from "@/components/ui/text";
import { View, Image } from "react-native";
import { SvgUri } from "react-native-svg";

function extractDriveFileId(url: string): string | null {
  // Matches both /file/d/FILEID/ and id=FILEID
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] || match[2] : null;
}

export default function AchievementDisplay({
  title,
  description,
  badge, // badge is the Google Drive link
}: {
  title: string;
  description: string;
  badge: string;
}) {
  const fileId = extractDriveFileId(badge);
  console.log("fieldidshit:", fileId);
  console.log("badgeurlshit:", badge);
  const imageUrl = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
    : undefined;

  return (
    <View className="p-5 mb-4 w-full bg-lightBlue rounded-xl shadow-main">
      {imageUrl && (
        <Image source={{ uri: imageUrl }} className="h-[50px] w-[50px]" />
      )}

      <Text className="font-bold text-lg">{title}</Text>
      <Text className="text-sm" numberOfLines={1} adjustsFontSizeToFit>
        {description}
      </Text>
    </View>
  );
}
