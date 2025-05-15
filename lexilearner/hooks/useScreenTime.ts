import app from "@/app";
import { createSession, endSession } from "@/services/UserService";
import { useUserStore } from "@/stores/userStore";
import React, { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

//TODO: mo create sesh dayun sya and naay edge case pretty sure nga lahi nga userid iya icredit rn tangina
export default function useScreenTime() {
  const appState = useRef(AppState.currentState);
  const sessionId = useRef<string | null>(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const handleSessionStart = async () => {
      if (user?.role === "Pupil" && !sessionId.current) {
        try {
          await createSession().then((response) => {
            sessionId.current = response.id;
            console.log("Session created:", sessionId.current);
          });
        } catch (error) {
          console.error("Error creating session:", error);
        }
      }
    };

    const handleSessionEnd = async () => {
      if (user?.role === "Pupil" && sessionId.current) {
        try {
          await endSession(sessionId.current).then((response) => {
            console.log("Session ended:", response.endAt);
            sessionId.current = null;
          });
        } catch (error) {
          console.error("Error ending session:", error);
        }
      }
    };

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      console.log(user?.role);
      if (nextAppState === "active") {
        await handleSessionStart();
        console.log("App is active");
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        await handleSessionEnd();
        console.log("App is inactive or in background");
      }
      appState.current = nextAppState;
    };

    if (appState.current === "active") {
      handleSessionStart();
    }

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      handleSessionEnd();
    };
  }, []);

  return null;
}
