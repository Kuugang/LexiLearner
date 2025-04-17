import { router } from "expo-router";
import { useStories } from "@/services/ReadingMaterial";
import ReadingContent from "@/components/ReadingContent";

//Components
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

import { CircleUser, Search, Flame } from "lucide-react-native";
import { useEffect } from "react";

interface HomeScreenProps {}

export default function HomeScreen({}: HomeScreenProps): JSX.Element {
  const { data: stories, isLoading: isStoriesLoading } = useStories();

  // useEffect(() => {
  //   router.push("/home");
  // }, []);

  return (
    <ScrollView className="bg-background">
      {/* TODO: MAKE THIS INTO COMPONENT*/}
      <View className="flex flex-row gap-2 items-center w-full p-4">
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <CircleUser color="#FFD43B" size={30} />
        </TouchableOpacity>

        <View>
          <Flame color="red" size={30} />
          <Text className="text-red-500 font-bold absolute -bottom-1 -right-1">
            3
          </Text>
        </View>

        <View className="relative flex-1">
          <Search
            size={20}
            color="#888"
            style={{
              position: "absolute",
              left: 10,
              top: 12,
              zIndex: 1,
            }}
          />
          <Input
            className="pl-10 py-3 rounded-lg w-full"
            onFocus={() => router.push("/explore")}
            placeholder="Search for stories..."
            aria-labelledby="label-for-searchStories"
            aria-errormessage="inputError"
          />
        </View>
      </View>

      <View className="flex flex-row items-center px-4 py-4 bg-yellowOrange">
        <View className="flex-1 pr-2">
          <Text className="text-orange text-4xl font-bold text-wrap">
            Ready for a Journey?
          </Text>
        </View>

        <Image
          source={require("@/assets/images/woman-reading-2.png")}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
          alt="Woman reading"
        />
      </View>

      <View className="flex-1  w-full h-60 p-4">
        <Text className="text-2xl font-bold">Recommended</Text>

        <ReadingContent
          Type={"Recommended"}
          Id={"123"}
          Content={`This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    "Cat in the Hat" is a delightful and whimsical story by Dr. Seuss, packed with fun and chaos. The plot revolves around a young brother and sister who are stuck indoors on a rainy day. Their boredom is quickly turned upside down when the mischievous Cat in the Hat shows up, bringing along his troublesome friends, Thing 1 and Thing 2. Together, they cause mayhem and mess, but they also help turn the day into an unforgettable adventure. 

    The Cat’s antics and the antics of his companions are a source of laughter and imagination, all while teaching important lessons about responsibility and the consequences of causing trouble. This story is known for its simple rhymes and repetitive words, making it perfect for young readers to follow along with and build their reading skills. Whether it’s parents, teachers, or kids, "Cat in the Hat" has earned a lasting spot in the hearts of many for its playful nature and engaging characters.

    Dr. Seuss’s trademark use of vibrant illustrations and clever wordplay makes the story even more fun. The characters like Thing 1 and Thing 2, and the talking fish, add to the charm and humor. The book's smaller format and easy-to-read design make it great for kids aged 3-7 to practice reading on their own. 

    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!
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
        <Text className="text-2xl font-bold">Explore</Text>
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
