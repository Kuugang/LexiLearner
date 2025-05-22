import React from "react";
import { View, Text, ActivityIndicator, Modal, StatusBar } from "react-native";

interface LoadingScreenProps {
  visible?: boolean;
  message?: string;
  overlay?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  visible = true,
  message = "Give us a moment...",
  overlay = false,
}) => {
  if (overlay) {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        statusBarTranslucent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
          <ActivityIndicator size="large" color="#6B9BD2" />
          <Text
            style={{
              marginTop: 24,
              fontSize: 18,
              color: "#6B9BD2",
              textAlign: "center",
              fontWeight: "400",
            }}
          >
            {message}
          </Text>
        </View>
      </Modal>
    );
  }

  if (!visible) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <ActivityIndicator size="large" color="#6B9BD2" />
        <Text
          style={{
            marginTop: 24,
            fontSize: 18,
            color: "#6B9BD2",
            textAlign: "center",
            fontWeight: "400",
          }}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

export default LoadingScreen;
