import { Text } from "@/components/ui/text";
import { useGetCoverFromGDrive } from "@/hooks/useExtractDriveFileId";
import { View, Image } from "react-native";

export function AchievementDisplay({
  title,
  description,
  badge, // badge is the Google Drive link
}: {
  title: string;
  description: string;
  badge: string;
}) {
  const imageUrl = useGetCoverFromGDrive(badge);

  return (
    <View className="p-5 mb-4 w-full bg-lightBlue rounded-xl shadow-main flex flex-row items-center">
      {imageUrl && (
        <Image source={{ uri: imageUrl }} className="h-[30px] w-[30px] mr-4 " />
      )}
      <View>
        <Text className="font-bold text-lg">{title}</Text>
        <Text className="text-sm" numberOfLines={1} adjustsFontSizeToFit>
          {description}
        </Text>
      </View>
    </View>
  );
}

export function AwardIcon({ badge }: { badge: string }) {
  const imageUrl = useGetCoverFromGDrive(badge);
  return (
    <View className="p-4 rounded-md bg-yellowOrange border-2 rounded-xl border-lightGray border-b-4 my-1 p-4">
      {imageUrl && (
        <Image source={{ uri: imageUrl }} className="h-[30px] w-[30px]" />
      )}
    </View>
  );
}
