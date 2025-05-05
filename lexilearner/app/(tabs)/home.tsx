import { router } from "expo-router";
import { useStories } from "@/services/ReadingMaterial";
import { memo } from "react";
import ReadingContent from "@/components/ReadingContent";

//Components
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

import { CircleUser, Search, Flame } from "lucide-react-native";

function HomeScreen() {
  const { data: stories, isLoading: isStoriesLoading } = useStories();

  // useEffect(() => {
  //   router.push("/minigames/fillintheblanks");
  // }, []);

  return (
    <ScrollView className="bg-background">
      {/* TODO: MAKE THIS INTO COMPONENT*/}
      <View className="flex flex-row gap-2 items-center w-full p-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
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

      <View
        className="flex flex-row items-center px-4 py-4 bg-yellowOrange"
        style={{
          borderBottomLeftRadius: 40,
        }}
      >
        <View className="flex-1 pr-2">
          <Text className="p-3 text-orange text-3xl font-bold text-wrap">
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
          type={"Recommended"}
          id={"123"}
          content={`
    This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions!


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
          title={"Cat In The Hat"}
          author={"Dr. Seuss"}
          description="Have a ball with Dr. Seuss and the Cat in the Hat in this classic picture book...but don't forget to clean up your mess!
Then he said That is that.
And then he was gone
With a tip of his hat.
A dreary day turns into a wild romp when this beloved story introduces readers to the Cat in the Hat and his troublemaking friends, Thing 1 and Thing 2 – And don't forget Fish! A favorite among kids, parents and teachers, this story uses simple words and basic rhyme to encourage and delight beginning readers.
Originally created by Dr. Seuss himself, Beginner Books are fun, funny, and easy to read. These unjacketed hardcover early readers encourage children to read all on their own, using simple words and illustrations. Smaller than the classic large format Seuss picture books like The Lorax and Oh, The Places You'll Go!, these portable packages are perfect for practicing readers ages 3-7, and lucky parents too!"
          cover="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1468890477i/233093.jpg"
          genres={["Fiction"]}
          difficulty={10}
        />
      </View>

      <View className="flex-1 gap-4 w-full p-4">
        <Text className="text-2xl font-bold">Explore</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="p-2"
        >
          {isStoriesLoading && <Text>Loading stories...</Text>}
          {!isStoriesLoading && Array.isArray(stories) && stories?.length > 0
            ? stories?.map((item) => (
                <View key={item.id} className="mr-4">
                  <ReadingContent
                    type="ScrollView"
                    id={item.id}
                    title={item.title}
                    author={item.author}
                    description={item.description}
                    cover={item.cover}
                    content={item.content}
                    genres={item.genres}
                    difficulty={item.difficulty}
                  />
                </View>
              ))
            : !isStoriesLoading && (
                <Text className="text-gray-500">No stories available.</Text>
              )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

export default memo(HomeScreen);
