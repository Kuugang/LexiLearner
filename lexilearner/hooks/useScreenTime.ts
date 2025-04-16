import { useFocusEffect } from "@react-navigation/native";
import { useRef } from "react";

export function useScreenTime(onExit: (durationInSeconds: number) => void) {
  const startTime = useRef(0);

  useFocusEffect(() => {
    startTime.current = Date.now();

    return () => {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime.current) / 1000);
      onExit(duration);
    };
  });
}
