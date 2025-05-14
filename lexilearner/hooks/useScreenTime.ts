import app from "@/app";
import { createSession, endSession } from "@/services/UserService";
import { useUserStore } from "@/stores/userStore";
import React, { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

//TODO: mo create sesh dayun sya and naay edge case pretty sure nga lahi nga userid iya icredit rn tangina
export default function useScreenTime() {
  const appState = useRef(AppState.currentState);
  const [isInitialState, setIsInitialState] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      if (appState.current === "active" && isInitialState) {
        try {
          const response = await createSession();
          console.log("Session created on app open:", response);
          setSessionId(response.id);
          setIsInitialState(false);
        } catch (error) {
          console.error("Error creating session on app open:", error);
        }
      }
    };

    initializeSession();

    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active" || isInitialState) {
          try {
            const response = await createSession();
            console.log("Session created:", response);
            setSessionId(response.id);
          } catch (error) {
            console.error("Error creating session:", error);
          }

          setIsInitialState(false);
        } else if (
          nextAppState === "background" ||
          nextAppState === "inactive"
        ) {
          console.log("app background inactive shiesh");
          console.log(sessionId);

          if (sessionId) {
            try {
              const response = await endSession(sessionId);
              console.log("Session ended:", response.endAt);
              setSessionId(null);
            } catch (error) {
              console.error("Error ending session:", error);
            }
          }
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [sessionId]);

  return null;
}
