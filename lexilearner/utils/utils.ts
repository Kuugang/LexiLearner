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

export const validateField = (
  name: string,
  value: string,
  form: Record<string, any> = {},
) => {
  switch (name) {
    case "username":
      if (!value.trim() || !value) return "Username is required.";
      if (!value) return "Username is required.";
      return "";

    case "email":
      if (!value.trim() || !value) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email format.";
      return ""; // No error

    case "password":
      if (!value.trim() || !value) return "Password is required.";
      if (value.length < 6)
        return "Password must be at least 6 characters long.";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter.";
      if (!/[a-z]/.test(value))
        return "Password must contain at least one lowercase letter.";
      if (!/[0-9]/.test(value))
        return "Password must contain at least one number.";
      return ""; // No error

    case "confirmPassword":
      if (value !== form.password) return "Passwords no not match.";
      return "";

    default:
      return "";
  }
};
