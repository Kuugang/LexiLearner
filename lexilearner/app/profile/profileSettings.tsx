import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
export default function profileSettings() {
  return (
    <View className="p-10">
      <Heading>Profile</Heading>

      <Text>First Name</Text>
      <Input>
        <InputField placeholder="Hyun-seo" />
      </Input>

      <Text>Last Name</Text>
      <Input>
        <InputField placeholder="Lee" />
      </Input>

      <Text>Username</Text>
      <Input>
        <InputField placeholder="Leeseo" />
      </Input>

      <Text>Email</Text>
      <Input>
        <InputField placeholder="IVELesseo@starship.com" />
      </Input>

      <Text>Password</Text>
      <Input>
        <InputField placeholder="*****" />
      </Input>

      <Button>
        <ButtonText>DELETE ACCOUNT</ButtonText>
      </Button>
    </View>
  );
}
