import { router } from "expo-router";
import { useStories } from "@/services/ReadingMaterial";
import ReadingContent from "@/components/ReadingContent";

//Components
import { ScrollView, View } from "react-native";
import { Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Search } from "lucide-react-native";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface HomeScreenProps {}

export default function HomeScreen({}: HomeScreenProps): JSX.Element {
  const { data: stories, isLoading: isStoriesLoading } = useStories();

  return (
    <ScrollView>
      <View className="flex flex-col h-20 justify-center items-end">
        <View className="flex flex-row gap-2 justify-center">
          <Button
            className="bg-transparent self-start p-0"
            onPress={() => router.push("/profile")}
          >
            <FontAwesomeIcon
              style={{ color: "#FFD43B" }}
              size={30}
              icon={faUser}
            />
          </Button>

          <View className="relative">
            <Search className="absolute left-2 top-2" />
            <Input
              className="p-10 rounded-lg"
              onFocus={() => router.push("/explore")}
              placeholder="Search for stories..."
              aria-labelledby={`label-for-searchStories`}
              aria-errormessage="inputError"
            />
          </View>
        </View>
      </View>

      <View className="flex flex-row px-6 justify-center w-full items-center bg-orange-500">
        <Text className="text-3xl font-bold">Ready for a Journey? </Text>
        <Image
          source={require("@/assets/images/woman-reading-2.png")}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
          alt="Woman reading"
        />
      </View>

      <View className="flex-1  w-full h-60 p-4">
        <Text>Recommended</Text>

        <ReadingContent
          Type={"Recommended"}
          Id={"123"}
          Content={`
    "Cat in the Hat" is a delightful and whimsical story by Dr. Seuss, packed with fun and chaos. The plot revolves around a young brother and sister who are stuck indoors on a rainy day. Their boredom is quickly turned upside down when the mischievous Cat in the Hat shows up, bringing along his troublesome friends, Thing 1 and Thing 2. Together, they cause mayhem and mess, but they also help turn the day into an unforgettable adventure. 

    The Cat’s antics and the antics of his companions are a source of laughter and imagination, all while teaching important lessons about responsibility and the consequences of causing trouble. This story is known for its simple rhymes and repetitive words, making it perfect for young readers to follow along with and build their reading skills. Whether it’s parents, teachers, or kids, "Cat in the Hat" has earned a lasting spot in the hearts of many for its playful nature and engaging characters.

    Dr. Seuss’s trademark use of vibrant illustrations and clever wordplay makes the story even more fun. The characters like Thing 1 and Thing 2, and the talking fish, add to the charm and humor. The book's smaller format and easy-to-read design make it great for kids aged 3-7 to practice reading on their own. 

    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
  `}
          Title={"Cat In The Hat"}
          Author={"Dr. Seuss"}
          Description="Have a ball with Dr. Seuss and the Cat in the Hat in this classic picture book...but don't forget to clean up your mess!
Then he said That is that.
And then he was gone
With a tip of his hat.
A dreary day turns into a wild romp when this beloved story introduces readers to the Cat in the Hat and his troublemaking friends, Thing 1 and Thing 2 – And don't forget Fish! A favorite among kids, parents and teachers, this story uses simple words and basic rhyme to encourage and delight beginning readers.
Originally created by Dr. Seuss himself, Beginner Books are fun, funny, and easy to read. These unjacketed hardcover early readers encourage children to read all on their own, using simple words and illustrations. Smaller than the classic large format Seuss picture books like The Lorax and Oh, The Places You'll Go!, these portable packages are perfect for practicing readers ages 3-7, and lucky parents too!"
          Cover="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1468890477i/233093.jpg"
          Genre={["Fiction"]}
          Difficulty={10}
        />
      </View>

      <View className="flex-1 gap-4 w-full p-4">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="p-2"
        >
          {!isStoriesLoading &&
            stories?.map((item) => (
              <View key={item.Id} className="mr-4">
                <ReadingContent
                  Type="ScrollView"
                  Id={item.Id}
                  Title={item.Title}
                  Author={item.Author}
                  Description={item.Description}
                  Cover={item.Cover}
                  Content={item.Content}
                  Genre={item.Genre}
                  Difficulty={item.Difficulty}
                />
              </View>
            ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
