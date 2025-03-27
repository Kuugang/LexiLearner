export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1]; // Get payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Fix encoding
    return JSON.parse(atob(base64)); // Decode Base64 & parse JSON
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
