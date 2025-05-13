import React, { useContext, useState, useEffect } from "react";
import SignUp1 from "@/components/Auth/SignUp1";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { validateField } from "@/utils/utils";
import { checkUserExist } from "@/services/UserService";
import { RegisterFormContext } from "./_layout";

// Define error state type for type safety
interface FormErrors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function Step1() {
  const context = useContext(RegisterFormContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  // Clear errors when form data changes
  useEffect(() => {
    if (context?.registerForm) {
      setFormErrors({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        role: "",
      });
    }
  }, [context?.registerForm]);

  const validateForm = () => {
    if (!context?.registerForm) return false;

    const registerForm = context.registerForm;
    const newErrors: FormErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "",
    };

    let isValid = true;

    // Process all fields and collect errors
    Object.keys(registerForm).forEach((field) => {
      // Type assertion to handle index access
      const fieldKey = field as keyof typeof registerForm;
      const error = validateField(field, registerForm[fieldKey], registerForm);

      if (error) {
        // Type assertion to handle index access
        (newErrors as any)[field] = error;
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const checkExistingUser = async () => {
    if (!context?.registerForm) return false;

    const registerForm = context.registerForm;
    const newErrors: FormErrors = { ...formErrors };
    let isValid = true;

    try {
      // Check email
      const emailResponse = await checkUserExist("email", registerForm.email);
      console.log("Email check complete:", emailResponse);

      if (emailResponse?.statusCode === 200) {
        newErrors.email = "Email is already in use";
        isValid = false;
      }
    } catch (error) {
      console.error("Email check failed:", error);
      Alert.alert(
        "Connection Error",
        "Unable to verify email. Please check your connection and try again."
      );
      return false;
    }

    try {
      // Check username
      const usernameResponse = await checkUserExist(
        "username",
        registerForm.username
      );
      console.log("Username check complete:", usernameResponse);

      if (usernameResponse?.statusCode === 200) {
        newErrors.username = "Username is already taken";
        isValid = false;
      }
    } catch (error) {
      console.error("Username check failed:", error);
      Alert.alert(
        "Connection Error",
        "Unable to verify username. Please check your connection and try again."
      );
      return false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleStep = async () => {
    if (isLoading) return; // Prevent multiple submissions

    try {
      console.log("Starting registration step 1 validation");
      setIsLoading(true);

      // Validate form fields
      const isFormValid = validateForm();
      if (!isFormValid) {
        console.log("Form validation failed");
        setIsLoading(false);
        return;
      }

      console.log("Form validation passed, checking if user exists");

      // Check if user exists
      const isUserNew = await checkExistingUser();
      if (!isUserNew) {
        console.log("User already exists");
        setIsLoading(false);
        return;
      }

      console.log("All checks passed, proceeding to step 2");
      router.push("/signup2");
    } catch (error) {
      console.error("Unexpected error in registration process:", error);
      Alert.alert(
        "Registration Error",
        "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!context?.registerForm) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading registration form...</Text>
      </View>
    );
  }

  // Assuming SignUp1 component doesn't have isLoading prop based on the error
  return (
    <>
      <SignUp1 formErrors={formErrors} handleStep={handleStep} />
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10, color: "#fff" }}>Verifying...</Text>
        </View>
      )}
    </>
  );
}
