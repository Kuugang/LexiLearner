import React, { useEffect, useRef } from "react";
import {
  View,
  Modal,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";

interface LoadingScreenFormProps {
  visible?: boolean;
}

const LoadingScreenForm: React.FC<LoadingScreenFormProps> = ({
  visible = true,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    if (visible) {
      spinAnimation.start();
    } else {
      spinAnimation.stop();
    }

    return () => spinAnimation.stop();
  }, [visible, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="light-content"
        />
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[styles.spinner, { transform: [{ rotate: spin }] }]}
          >
            {[...Array(8)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.spinnerLine,
                  {
                    transform: [{ rotate: `${index * 45}deg` }],
                    opacity: 1 - index * 0.1,
                  },
                ]}
              />
            ))}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  loadingContainer: {
    backgroundColor: "rgba(30, 58, 100, 0.9)",
    borderRadius: 12,
    padding: 20,
    minWidth: 70,
    minHeight: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  spinner: {
    width: 24,
    height: 24,
    position: "relative",
  },
  spinnerLine: {
    position: "absolute",
    width: 3,
    height: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 1.5,
    top: 0,
    left: "50%",
    marginLeft: -1.5,
    transformOrigin: "50% 12px",
  },
});

export default LoadingScreenForm;
