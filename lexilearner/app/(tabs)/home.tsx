import { useState } from "react";
import { ScrollView, View, Text } from "react-native";

//Components
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { SearchIcon } from "@/components/ui/icon";
import ReadingContent from "@/components/ReadingContent";
import { ReadingContentType } from "@/models/ReadingContent";

interface HomeScreenProps {}

interface ContentCategory {
  title: string;
  items: ReadingContentType[];
}

export default function HomeScreen({}: HomeScreenProps): JSX.Element {
  const [categories, setCategories] = useState<ContentCategory[]>([
    {
      title: "Top Picks For You",
      items: [
        {
          Id: "101",
          Type: "ScrollView",
          Title: "Beyond the Kingdoms",
          Author: "Chris Colfer",
          Description:
            "The Masked Man is on the loose in the Land of Stories, and it's up to Alex and Conner Bailey to stop him—except Alex has been thrown off the Fairy Council, and no one will believe they’re in danger. With only the help of a ragtag group—including Goldilocks, Jack, Red Riding Hood, and Mother Goose with her gander, Lester—the Bailey twins uncover the Masked Man’s secret scheme: he possesses a powerful magic potion that turns every book it touches into a portal. Even worse, he is recruiting an army of literature's greatest villains! Thus begins a race through the magical Land of Oz, the fantastical world of Neverland, the madness of Wonderland, and beyond. Can Alex and Conner catch up to the Masked Man, or will they be one step behind until it's too late? Fairy tales and classic stories collide in the fourth adventure in the bestselling Land of Stories series as the twins travel beyond the kingdoms!",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1430009826i/24968392.jpg",
          Content:
            "Once upon a time, there were twins named Alex and Conner...",
          Genre: "Fantasy",
          Difficulty: 3,
        },
        {
          Id: "102",
          Type: "ScrollView",
          Title: "Harry Potter and the Prisoner of Azkaban",
          Author: "J.K. Rowling",
          Description:
            "Harry Potter, along with his best friends, Ron and Hermione, is about to start his third year at Hogwarts School of Witchcraft and Wizardry. Harry can't wait to get back to school after the summer holidays. (Who wouldn't if they lived with the horrible Dursleys?) But when Harry gets to Hogwarts, the atmosphere is tense. There's an escaped mass murderer on the loose, and the sinister prison guards of Azkaban have been called in to guard the school...",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630547330i/5.jpg",
          Content: "Mr. and Mrs. Dursley of number four, Privet Drive...",
          Genre: "Fantasy",
          Difficulty: 4,
        },
        {
          Id: "103",
          Type: "ScrollView",
          Title: "The Lightning Thief",
          Author: "Rick Riordan",
          Description:
            "The first book in the New York Times best-selling saga with a cover image and an 8-page photo insert from the Disney+ series! Read the book that launched Percy Jackson into the stratosphere before the Disney+ series comes out! Lately, mythological monsters and the Olympian gods seem to be walking straight out of the pages of Percy Jackson’s Greek mythology textbook and into his life. Zeus's master lightning bolt has been stolen, and Percy is the prime suspect. Percy and his friends have just ten days to find and return Zeus's stolen property and bring peace to a warring Mount Olympus. Whether you are new to Percy or a longtime fan, this tie-in paperback edition with full-color photos from the Disney+ series is a must-have for your library.",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1684776677i/123675190.jpg",
          Content: "Look, I didn't want to be a half-blood...",
          Genre: "Mythology",
          Difficulty: 3,
        },
        {
          Id: "104",
          Type: "ScrollView",
          Title: "Charlotte's Web",
          Author: "E.B. White",
          Description: `This beloved book by E. B. White, author of Stuart Little and The Trumpet of the Swan, is a classic of children's literature that is "just about perfect." This high-quality paperback features vibrant illustrations colorized by Rosemary Wells! Some Pig. Humble. Radiant. These are the words in Charlotte's Web, high up in Zuckerman's barn. Charlotte's spiderweb tells of her feelings for a little pig named Wilbur, who simply wants a friend. They also express the love of a girl named Fern, who saved Wilbur's life when he was born the runt of his litter. E. B. White's Newbery Honor Book is a tender novel of friendship, love, life, and death that will continue to be enjoyed by generations to come. This edition contains newly color illustrations by Garth Williams, the acclaimed illustrator of E. B. White's Stuart Little and Laura Ingalls Wilder's Little House series, among many other books.`,
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1628267712i/24178.jpg",
          Content: "Where's Papa going with that ax?...",
          Genre: "Children's",
          Difficulty: 2,
        },
        {
          Id: "105",
          Type: "ScrollView",
          Title: "The Hobbit",
          Author: "J.R.R. Tolkien",
          Description:
            "First published over 50 years ago, J.R.R. Tolkien's 'The Hobbit' has become one of the best-loved books of all time. Now Tolkien's fantasy classic has been adapted into a fully painted graphic novel. 'The Hobbit' is the story of Bilbo Baggins…a quiet and contented hobbit whose life is turned upside down when he joins the wizard Gandalf and thirteen dwarves on their quest to reclaim the dwarves' stolen treasure. It is a journey fraught with danger – and in the end it is Bilbo alone who must face the guardian of this treasure, the most-dreaded dragon Smaug. Illustrated in full colour throughout, and accompanied by the carefully abridged text of the original novel, this handsome authorised edition will introduce new generations to a magical masterpiece – and be treasured by Hobbit fans of all ages, everywhere.",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1374681632i/659469.jpg",
          Content: "In a hole in the ground there lived a hobbit...",
          Genre: "Fantasy",
          Difficulty: 5,
        },
      ],
    },
    {
      title: "New Releases",
      items: [
        {
          Id: "201",
          Type: "ScrollView",
          Title: "The Midnight Library",
          Author: "Matt Haig",
          Description: "Between life and death",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg",
          Content: "Nineteen years before she decided to die...",
          Genre: "Fiction",
          Difficulty: 4,
        },
        {
          Id: "202",
          Type: "ScrollView",
          Title: "Project Hail Mary",
          Author: "Andy Weir",
          Description: "A lone astronaut must save humanity",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
          Content:
            "I wake up to the pain. Not the discomfort kind, but the truly...",
          Genre: "Sci-Fi",
          Difficulty: 5,
        },
        {
          Id: "203",
          Type: "ScrollView",
          Title: "The Hill We Climb",
          Author: "Amanda Gorman",
          Description: "An inaugural poem for the country",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1612178266i/56914101.jpg",
          Content:
            "When day comes, we ask ourselves, where can we find light...",
          Genre: "Poetry",
          Difficulty: 3,
        },
        {
          Id: "204",
          Type: "ScrollView",
          Title: "Klara and the Sun",
          Author: "Kazuo Ishiguro",
          Description: "A story of connection",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/I/71KilybDOoL.jpg",
          Content:
            "When we were new, Rosa and I were mid-store, on the magazines table...",
          Genre: "Literary Fiction",
          Difficulty: 4,
        },
        {
          Id: "205",
          Type: "ScrollView",
          Title: "The Four Winds",
          Author: "Kristin Hannah",
          Description: "An epic novel of love and heroism",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/I/81WojUxbbFL.jpg",
          Content: "She had always been different...",
          Genre: "Historical Fiction",
          Difficulty: 4,
        },
      ],
    },
    {
      title: "Educational Reads",
      items: [
        {
          Id: "301",
          Type: "ScrollView",
          Title: "A Brief History of Time",
          Author: "Stephen Hawking",
          Description: "From big bang to black holes",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg",
          Content: "Our picture of the universe...",
          Genre: "Science",
          Difficulty: 7,
        },
        {
          Id: "302",
          Type: "ScrollView",
          Title: "Sapiens",
          Author: "Yuval Noah Harari",
          Description: "A brief history of humankind",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg",
          Content:
            "About 13.5 billion years ago, matter, energy, time and space...",
          Genre: "History",
          Difficulty: 6,
        },
        {
          Id: "303",
          Type: "ScrollView",
          Title: "Cosmos",
          Author: "Carl Sagan",
          Description: "A personal voyage",
          Cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388620656i/55030.jpg",
          Content: "The Cosmos is all that is or ever was or ever will be...",
          Genre: "Science",
          Difficulty: 5,
        },
      ],
    },
  ]);

  return (
    <ScrollView>
      <View className="p-8">
        <Input className="px-3">
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Search..." />
        </Input>
      </View>

      <View className="flex flex-row px-4 justify-center w-full items-center bg-background-yellowOrange">
        <Heading size="2xl" className="flex-1">
          Ready for a Journey?
        </Heading>

        <Image
          source={require("@/assets/images/woman-reading-2.png")}
          className="bottom-0 right-0 w-64 h-64"
          resizeMode="contain"
          alt="Woman reading"
        />
      </View>

      <View className="flex-1  w-full h-60 p-4">
        <Heading>Recommended</Heading>

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
          Genre={"Fiction"}
          Difficulty={10}
        />
      </View>

      <View className="flex-1 gap-4 w-full p-4">
        {categories.map((category, index) => (
          <View key={index} className="mb-4">
            <Text className="text-xl font-bold mb-2">{category.title}</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              className="p-2"
            >
              {category.items.map((item) => (
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
        ))}
      </View>
    </ScrollView>
  );
}
