import { Platform } from "react-native";
import { API_URL } from "../utils/constants";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";


AMBOT NGANONG NAGUbA NI LITSI MANING REACT OI AHAHAHAHHAHAHAHAHAHAH
// import {
//   AccessToken,
//   AuthenticationToken,
//   LoginManager,
// } from "react-native-fbsdk-next";

interface AuthResponse {
  message: string;
  data: {
    token: string;
  };
}

export const login = async (email: string, password: string) => {
  try {
    console.log(`${API_URL}/auth/login`);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log(response);

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Login failed: " + data.message);
    }

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred",
    );
  }
};

export const signUp = async (
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Sign Up failed: " + data.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred",
    );
  }
};

export const register = async (
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
) => {
  const response = await axios.post(`${API_URL}/register`, {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
  });
  return response.data;
};

export const tokenAuth = async (
  Provider: number, // 0 -> Google, 1 -> Facebook
  Token: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: Token, provider: Provider }),
    });
    if (!response.ok) {
      throw new Error("Failed to authenticate with backend");
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred",
    );
  }
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    return await GoogleSignin.signIn(); // Returns user info
  } catch (error: any) {
    if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error("Google Sign-In already in progress");
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error("Google Play Services not available");
    }
    throw new Error("Google Sign-In failed");
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await LoginManager.logInWithPermissions(
      ["public_profile", "email"],
      "limited",
      "my_nonce", // Optional
    );
    let token;
    if (Platform.OS === "ios") {
      // This token **cannot** be used to access the Graph API.
      // https://developers.facebook.com/docs/facebook-login/limited-login/
      const result = await AuthenticationToken.getAuthenticationTokenIOS();
      // console.log(result?.authenticationToken);
      //TODO IOS FACEBOOK
    } else {
      // This token can be used to access the Graph API.
      const result = await AccessToken.getCurrentAccessToken();
      token = result?.accessToken;
      // console.log(result?.accessToken);
    }
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  // Handle logout (clear token, notify server if needed)
};
