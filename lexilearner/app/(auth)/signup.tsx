import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button";

import { Text } from "@/components/ui/text";

import { useGlobalContext } from "@/context/GlobalProvider";
import { Link, router } from "expo-router";
import { useState } from "react";
import { ScrollView, ToastAndroid, View } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

import { signInWithGoogle, tokenAuth } from "@/services/AuthService";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useAuthContext } from "@/context/AuthProvider";

export default function SignUp() {
  const { signup } = useAuthContext();
  const { isLoading, setIsLoading, isLogged } = useGlobalContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  async function handleSignup() {
    //TODO Data validation and loader
    setIsLoading(true);
    try {
      await signup(
        form.email,
        form.password,
        form.confirmPassword,
        form.firstName,
        form.lastName,
      );

      ToastAndroid.show("Sign Up Success", ToastAndroid.LONG);
    } catch (error: any) {
      ToastAndroid.show(
        error instanceof Error ? error.message : "An error occurred",
        ToastAndroid.LONG,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return <Text>Signup</Text>;
}

{
  /* <ScrollView> */
}
{
  /*   <View */
}
{
  /*     style={{ */
}
{
  /*       flex: 1, */
}
{
  /*       width: "80%", */
}
{
  /*       flexDirection: "column", */
}
{
  /*       justifyContent: "space-evenly", */
}
{
  /*     }} */
}
{
  /*   > */
}
{
  /*     <Text bold>Sign Up</Text> */
}
{
  /**/
}
{
  /*     <FormField */
}
{
  /*       title="Email" */
}
{
  /*       value={form.email} */
}
{
  /*       handleChangeText={(text: string) => setForm({ ...form, email: text })} */
}
{
  /*       otherStyles="mt-7" */
}
{
  /*       keyboardType="email-address" */
}
{
  /*       placeholder={""} */
}
{
  /*     /> */
}
{
  /**/
}
{
  /*     <FormField */
}
{
  /*       title="Password" */
}
{
  /*       value={form.password} */
}
{
  /*       handleChangeText={(text: string) => */
}
{
  /*         setForm({ ...form, password: text }) */
}
{
  /*       } */
}
{
  /*       otherStyles="mt-7" */
}
{
  /*       placeholder={""} */
}
{
  /*     /> */
}
{
  /**/
}
{
  /*     <FormField */
}
{
  /*       title="Confirm Password" */
}
{
  /*       value={form.confirmPassword} */
}
{
  /*       handleChangeText={(text: string) => */
}
{
  /*         setForm({ ...form, confirmPassword: text }) */
}
{
  /*       } */
}
{
  /*       otherStyles="mt-7" */
}
{
  /*       placeholder={""} */
}
{
  /*     /> */
}
{
  /**/
}
{
  /*     <FormField */
}
{
  /*       title="First Name" */
}
{
  /*       value={form.firstName} */
}
{
  /*       handleChangeText={(text: string) => */
}
{
  /*         setForm({ ...form, firstName: text }) */
}
{
  /*       } */
}
{
  /*       otherStyles="mt-7" */
}
{
  /*       placeholder={""} */
}
{
  /*     /> */
}
{
  /**/
}
{
  /*     <FormField */
}
{
  /*       title="Last Name" */
}
{
  /*       value={form.lastName} */
}
{
  /*       handleChangeText={(text: string) => */
}
{
  /*         setForm({ ...form, lastName: text }) */
}
{
  /*       } */
}
{
  /*       otherStyles="mt-7" */
}
{
  /*       placeholder={""} */
}
{
  /*     /> */
}
{
  /**/
}
{
  /*     <Button onPress={handleSignup}>Sign Up</Button> */
}
{
  /*   </View> */
}
{
  /**/
}
{
  /*   <View */
}
{
  /*     style={{ */
}
{
  /*       flexDirection: "row", */
}
{
  /*       justifyContent: "center", */
}
{
  /*       paddingTop: 20, */
}
{
  /*     }} */
}
{
  /*   > */
}
{
  /*     <Text */
}
{
  /*       style={{ */
}
{
  /*         fontFamily: "Poppins-Regular", */
}
{
  /*       }} */
}
{
  /*     > */
}
{
  /*       Already have an account? */
}
{
  /*     </Text> */
}
{
  /*     <Link */
}
{
  /*       href="/" */
}
{
  /*       style={{ */
}
{
  /*         color: "blue", */
}
{
  /*         marginLeft: 5, */
}
{
  /*       }} */
}
{
  /*     > */
}
{
  /*       Log In */
}
{
  /*     </Link> */
}
{
  /*   </View> */
}
{
  /**/
}
{
  /*   <Text style={{ fontSize: 12 }}>Or</Text> */
}
{
  /**/
}
{
  /*   <GoogleSigninButton */
}
{
  /*     size={GoogleSigninButton.Size.Wide} */
}
{
  /*     color={GoogleSigninButton.Color.Dark} */
}
{
  /*     onPress={useGoogleAuth} */
}
{
  /*     disabled={isLoading} */
}
{
  /*   /> */
}
{
  /* </ScrollView> */
}
