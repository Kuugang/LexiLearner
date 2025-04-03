import { useState } from "react";
import { ScrollView, View, Text } from "react-native";

//Components
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { SearchIcon } from "@/components/ui/icon";
import ReadingContent from "@/components/ReadingContent";
import { ReadingItem } from "@/models/ReadingContent";

interface HomeScreenProps {}

interface ContentCategory {
  title: string;
  items: ReadingItem[];
}

export default function HomeScreen({}: HomeScreenProps): JSX.Element {
  const [categories, setCategories] = useState<ContentCategory[]>([
    {
      title: "Top Picks For You",
      items: [
        {
          id: "101",
          type: "ScrollView",
          title: "Beyond the Kingdoms",
          author: "Chris Colfer",
          description:
            "The Masked Man is on the loose in the Land of Stories, and it's up to Alex and Conner Bailey to stop him—except Alex has been thrown off the Fairy Council, and no one will believe they’re in danger. With only the help of a ragtag group—including Goldilocks, Jack, Red Riding Hood, and Mother Goose with her gander, Lester—the Bailey twins uncover the Masked Man’s secret scheme: he possesses a powerful magic potion that turns every book it touches into a portal. Even worse, he is recruiting an army of literature's greatest villains! Thus begins a race through the magical Land of Oz, the fantastical world of Neverland, the madness of Wonderland, and beyond. Can Alex and Conner catch up to the Masked Man, or will they be one step behind until it's too late? Fairy tales and classic stories collide in the fourth adventure in the bestselling Land of Stories series as the twins travel beyond the kingdoms!",
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1430009826i/24968392.jpg",
          content:
            "Once upon a time, there were twins named Alex and Conner...",
          genre: "Fantasy",
          difficulty: 3,
        },
        {
          id: "102",
          type: "ScrollView",
          title: "Harry Potter and the Prisoner of Azkaban",
          author: "J.K. Rowling",
          description:
            "Harry Potter, along with his best friends, Ron and Hermione, is about to start his third year at Hogwarts School of Witchcraft and Wizardry. Harry can't wait to get back to school after the summer holidays. (Who wouldn't if they lived with the horrible Dursleys?) But when Harry gets to Hogwarts, the atmosphere is tense. There's an escaped mass murderer on the loose, and the sinister prison guards of Azkaban have been called in to guard the school...",
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630547330i/5.jpg",
          content: "Mr. and Mrs. Dursley of number four, Privet Drive...",
          genre: "Fantasy",
          difficulty: 4,
        },
        {
          id: "103",
          type: "ScrollView",
          title: "The Lightning Thief",
          author: "Rick Riordan",
          description:
            "The first book in the New York Times best-selling saga with a cover image and an 8-page photo insert from the Disney+ series! Read the book that launched Percy Jackson into the stratosphere before the Disney+ series comes out! Lately, mythological monsters and the Olympian gods seem to be walking straight out of the pages of Percy Jackson’s Greek mythology textbook and into his life. Zeus's master lightning bolt has been stolen, and Percy is the prime suspect. Percy and his friends have just ten days to find and return Zeus's stolen property and bring peace to a warring Mount Olympus. Whether you are new to Percy or a longtime fan, this tie-in paperback edition with full-color photos from the Disney+ series is a must-have for your library.",
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1684776677i/123675190.jpg",
          content: "Look, I didn't want to be a half-blood...",
          genre: "Mythology",
          difficulty: 3,
        },
        {
          id: "104",
          type: "ScrollView",
          title: "Charlotte's Web",
          author: "E.B. White",
          description: `This beloved book by E. B. White, author of Stuart Little and The Trumpet of the Swan, is a classic of children's literature that is "just about perfect." This high-quality paperback features vibrant illustrations colorized by Rosemary Wells! Some Pig. Humble. Radiant. These are the words in Charlotte's Web, high up in Zuckerman's barn. Charlotte's spiderweb tells of her feelings for a little pig named Wilbur, who simply wants a friend. They also express the love of a girl named Fern, who saved Wilbur's life when he was born the runt of his litter. E. B. White's Newbery Honor Book is a tender novel of friendship, love, life, and death that will continue to be enjoyed by generations to come. This edition contains newly color illustrations by Garth Williams, the acclaimed illustrator of E. B. White's Stuart Little and Laura Ingalls Wilder's Little House series, among many other books.`,
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1628267712i/24178.jpg",
          content: "Where's Papa going with that ax?...",
          genre: "Children's",
          difficulty: 2,
        },
        {
          id: "105",
          type: "ScrollView",
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          description:
            "First published over 50 years ago, J.R.R. Tolkien's 'The Hobbit' has become one of the best-loved books of all time. Now Tolkien's fantasy classic has been adapted into a fully painted graphic novel. 'The Hobbit' is the story of Bilbo Baggins…a quiet and contented hobbit whose life is turned upside down when he joins the wizard Gandalf and thirteen dwarves on their quest to reclaim the dwarves' stolen treasure. It is a journey fraught with danger – and in the end it is Bilbo alone who must face the guardian of this treasure, the most-dreaded dragon Smaug. Illustrated in full colour throughout, and accompanied by the carefully abridged text of the original novel, this handsome authorised edition will introduce new generations to a magical masterpiece – and be treasured by Hobbit fans of all ages, everywhere.",
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1374681632i/659469.jpg",
          content: "In a hole in the ground there lived a hobbit...",
          genre: "Fantasy",
          difficulty: 5,
        },
      ],
    },
    {
      title: "New Releases",
      items: [
        {
          id: "201",
          type: "ScrollView",
          title: "The Midnight Library",
          author: "Matt Haig",
          description: "Between life and death",
          cover:
            "https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg",
          content: "Nineteen years before she decided to die...",
          genre: "Fiction",
          difficulty: 4,
        },
        {
          id: "202",
          type: "ScrollView",
          title: "Project Hail Mary",
          author: "Andy Weir",
          description: "A lone astronaut must save humanity",
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
          content:
            "I wake up to the pain. Not the discomfort kind, but the truly...",
          genre: "Sci-Fi",
          difficulty: 5,
        },
        {
          id: "203",
          type: "ScrollView",
          title: "The Hill We Climb",
          author: "Amanda Gorman",
          description: "An inaugural poem for the country",
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1612178266i/56914101.jpg",
          content:
            "When day comes, we ask ourselves, where can we find light...",
          genre: "Poetry",
          difficulty: 3,
        },
        {
          id: "204",
          type: "ScrollView",
          title: "Klara and the Sun",
          author: "Kazuo Ishiguro",
          description: "A story of connection",
          cover:
            "https://images-na.ssl-images-amazon.com/images/I/71KilybDOoL.jpg",
          content:
            "When we were new, Rosa and I were mid-store, on the magazines table...",
          genre: "Literary Fiction",
          difficulty: 4,
        },
        {
          id: "205",
          type: "ScrollView",
          title: "The Four Winds",
          author: "Kristin Hannah",
          description: "An epic novel of love and heroism",
          cover:
            "https://images-na.ssl-images-amazon.com/images/I/81WojUxbbFL.jpg",
          content: "She had always been different...",
          genre: "Historical Fiction",
          difficulty: 4,
        },
      ],
    },
    {
      title: "Educational Reads",
      items: [
        {
          id: "301",
          type: "ScrollView",
          title: "A Brief History of Time",
          author: "Stephen Hawking",
          description: "From big bang to black holes",
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg",
          content: "Our picture of the universe...",
          genre: "Science",
          difficulty: 7,
        },
        {
          id: "302",
          type: "ScrollView",
          title: "Sapiens",
          author: "Yuval Noah Harari",
          description: "A brief history of humankind",
          cover:
            "https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg",
          content:
            "About 13.5 billion years ago, matter, energy, time and space...",
          genre: "History",
          difficulty: 6,
        },
        {
          id: "303",
          type: "ScrollView",
          title: "Cosmos",
          author: "Carl Sagan",
          description: "A personal voyage",
          cover:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388620656i/55030.jpg",
          content: "The Cosmos is all that is or ever was or ever will be...",
          genre: "Science",
          difficulty: 5,
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
          Content={"Hello"}
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
                <View key={item.id} className="mr-4">
                  <ReadingContent
                    Type={item.type}
                    Id={item.id}
                    Title={item.title}
                    Author={item.author}
                    Description={item.description}
                    Cover={item.cover}
                    Content={item.content}
                    Genre={item.genre}
                    Difficulty={item.difficulty}
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
