import React from "react";
import { View } from "react-native";

type InteractionBlockerProps = {
  disabled: boolean;
  children: React.ReactNode;
};

const InteractionBlocker: React.FC<InteractionBlockerProps> = ({
  disabled,
  children,
}) => {
  return (
    <View
      style={{
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </View>
  );
};

export default InteractionBlocker;
