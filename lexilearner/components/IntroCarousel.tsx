import { Circle } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  View,
  Image,
  Text,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface CarouselItem {
  text: string;
  image: any;
}

interface IntroCarouselProps {
  data: CarouselItem[];
}

const IntroCarousel = ({ data }: IntroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View className="flex-1">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{ width: screenWidth }}
            className="flex-1 justify-center items-center"
          >
            <View className="flex-1 justify-center items-center">
              <Image source={item.image} resizeMode="contain" />
            </View>

            <View>
              <Text
                className="text-2xl font-bold leading-relaxed"
                style={{
                  flexWrap: "wrap",
                  paddingHorizontal: 20,
                }}
              >
                {item.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Indicator dots */}
      <View className="flex-row justify-center items-center py-8">
        {data.map((_, index) => (
          <View
            key={index}
            className={`w-3 h-3 rounded-full mx-2 ${
              index === activeIndex ? "bg-yellowOrange" : "bg-lightGray"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default IntroCarousel;
