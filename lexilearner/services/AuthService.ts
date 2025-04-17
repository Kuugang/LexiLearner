import { Platform } from "react-native";
import { API_URL } from "../utils/constants";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "393477780121-6i4h7kp3f18avqb857j8jlmb5uv5q5j6.apps.googleusercontent.com",
  offlineAccess: true, // Request refresh token
  forceCodeForRefreshToken: true, // Ensure token is provided
  scopes: ["profile", "email"],
});

import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from "react-native-fbsdk-next";
import { axiosInstance } from "@/utils/axiosInstance";

interface AuthResponse {
  message: string;
  data: {
    token: string;
  };
}

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/login",
      {
        email,
        password,
      },
      {
        validateStatus: () => true,
      },
    );

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred",
    );
  }
};

export const signUp = async (registerForm: Record<string, any>) => {
  const response = await axiosInstance.post(
    "/auth/register",
    registerForm,

    {
      validateStatus: () => true,
    },
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const tokenAuth = async (
  Provider: number, // 0 -> Google, 1 -> Facebook
  Token: string,
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post(
      "/auth/token",
      {
        token: Token,
        provider: Provider,
      },
      {
        validateStatus: () => true,
      },
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred",
    );
  }
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    let data = await GoogleSignin.signIn(); // Returns user info
    await GoogleSignin.signOut();
    return data;
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
    await LoginManager.logInWithPermissions(
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
