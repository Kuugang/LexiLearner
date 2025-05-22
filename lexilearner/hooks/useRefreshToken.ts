import { refreshAccessToken } from "@/services/AuthService";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function useRefreshToken() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(
      () => {
        refreshAccessToken();
      },
      7 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, [user]);

  return null;
}
