import React, { useRef, useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import {
  ScrollView,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  InteractionManager,
  NativeModules,
} from "react-native";
import SearchBar, { SearchBarRef } from "@/components/Classroom/SearchBar";
import { Pupil } from "@/services/ClassroomService";
import { Ionicons } from "@expo/vector-icons";
import { displayPupilName, getRandomColor } from "@/utils/utils";

type AddPupilModalProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  filteredPupils: Pupil[];
  selectedPupils: Pupil[];
  searching: boolean;
  showNoResults: boolean;
  handleSelectPupil: (pupil: Pupil) => void;
  handleRemoveSelectedPupil: (pupilId: string) => void;
  handleAddSelectedPupils: () => void;
  handleTextChange: (text: string) => void;
  searchInputRef: React.RefObject<SearchBarRef>;
  isClearing: React.MutableRefObject<boolean>;
  onClose: () => void;
};

const { height, width } = Dimensions.get("window");

if (Platform.OS === "android") {
  if (Platform.Version >= 21) {
    if (NativeModules.AndroidKeyboardAdjust) {
      NativeModules.AndroidKeyboardAdjust.setAdjustNothing();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    ...(Platform.OS === "ios"
      ? {
          backdropFilter: "blur(5px)",
        }
      : {}),
  },
  modalView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#DEDEDE",
    borderRadius: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  cancelButtonContainer: {
    minWidth: 50,
    alignItems: "flex-start",
  },
  cancelButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  addButtonContainer: {
    minWidth: 50,
    alignItems: "flex-end",
  },
  addButton: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  searchContainer: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
  },
  selectedPupilsContainer: {
    marginBottom: 10,
  },
  selectedPupilsScroll: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  selectedPupilItem: {
    alignItems: "center",
    width: 80,
    marginHorizontal: 4,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#D3D3D3",
    borderRadius: 999,
    padding: 4,
    zIndex: 10,
  },
  pupilFirstName: {
    color: "#000",
    textAlign: "center",
    marginTop: 4,
    fontSize: 12,
  },
  pupilLastName: {
    color: "#000",
    textAlign: "center",
    fontSize: 12,
  },
  suggestedLabel: {
    fontSize: 16,
    color: "#777",
    fontWeight: "500",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    maxHeight: height * 0.25,
  },
  pupilItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pupilInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pupilAvatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pupilAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pupilName: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  selectionCircle: {
    height: 26,
    width: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionCircleSelected: {
    backgroundColor: "transparent",
    borderColor: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginLeft: 72,
    marginRight: 16,
  },
  noResultsContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    color: "#777",
    fontSize: 16,
  },
});

export default function AddPupilModal({
  searchText,
  setSearchText,
  filteredPupils,
  selectedPupils,
  searching,
  showNoResults,
  handleSelectPupil,
  handleRemoveSelectedPupil,
  handleAddSelectedPupils,
  handleTextChange,
  searchInputRef,
  isClearing,
  onClose,
}: AddPupilModalProps) {
  const isClosingModal = useRef(false);
  const [translateY] = useState(new Animated.Value(height));

  const keyboardDidShow = () => {
    console.log("Keyboard did show jake angel");
  };

  const keyboardDidHide = () => {
    console.log("Keyboard did hide jake angel");
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      keyboardDidShow
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      keyboardDidHide
    );

    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 300);
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const closeModal = () => {
    if (isClosingModal.current) return;

    Keyboard.dismiss();
    isClosingModal.current = true;

    Animated.timing(translateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      isClosingModal.current = false;
    });
  };

  return (
    <View style={[styles.container, { paddingBottom: 0 }]}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalView,
          {
            transform: [{ translateY }],
            bottom: 0,
            position: "absolute",
            zIndex: 9999,
          },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <TouchableOpacity
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.cancelButtonContainer}
          >
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Choose pupil</Text>
          </View>

          <View style={styles.addButtonContainer}>
            {selectedPupils.length > 0 ? (
              <TouchableOpacity
                onPress={handleAddSelectedPupils}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.addButton}>Add</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 50 }} />
            )}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search"
            initialValue={searchText}
            onSearch={handleTextChange}
            ref={searchInputRef}
            debounceTime={1000}
            blurOnSubmit={false}
            onClearPress={() => {
              isClearing.current = true;
              Keyboard.dismiss();
              setSearchText("");

              setTimeout(() => {
                isClearing.current = false;
              }, 300);
            }}
          />
        </View>

        <View style={styles.contentContainer}>
          {selectedPupils.length > 0 && (
            <View style={styles.selectedPupilsContainer}>
              <ScrollView
                horizontal
                style={styles.selectedPupilsScroll}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="none"
              >
                {selectedPupils.map((pupil) => {
                  const avatarColor = getRandomColor(
                    (pupil.firstName || "") + (pupil.lastName || "")
                  );

                  const initials = `${pupil.firstName?.charAt(0) || ""}${
                    pupil.lastName?.charAt(0) || ""
                  }`;

                  return (
                    <View key={pupil.id} style={styles.selectedPupilItem}>
                      <View style={styles.avatarContainer}>
                        <View
                          style={[
                            styles.avatar,
                            { backgroundColor: avatarColor },
                          ]}
                        >
                          <Text style={styles.avatarText}>
                            {initials.toUpperCase()}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() =>
                            handleRemoveSelectedPupil(pupil.id || "")
                          }
                          hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10,
                          }}
                        >
                          <Ionicons name="close" size={14} color="black" />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={styles.pupilFirstName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {pupil.firstName}
                      </Text>
                      <Text
                        style={styles.pupilLastName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {pupil.lastName}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Suggested Label */}
          <Text style={styles.suggestedLabel}>Suggested</Text>

          {searching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0A84FF" />
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="none"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {filteredPupils.length > 0 ? (
                <>
                  {filteredPupils.map((pupil) => {
                    const avatarColor = getRandomColor(
                      (pupil.firstName || "") + (pupil.lastName || "")
                    );

                    const initials = `${pupil.firstName?.charAt(0) || ""}${
                      pupil.lastName?.charAt(0) || ""
                    }`;
                    const isSelected = selectedPupils.some(
                      (p) => p.id === pupil.id
                    );

                    return (
                      <View key={pupil.id}>
                        <TouchableOpacity
                          style={styles.pupilItem}
                          onPress={() => {
                            Keyboard.dismiss();
                            handleSelectPupil(pupil);
                          }}
                        >
                          <View style={styles.pupilInfoContainer}>
                            <View
                              style={[
                                styles.pupilAvatar,
                                { backgroundColor: avatarColor },
                              ]}
                            >
                              <Text style={styles.pupilAvatarText}>
                                {initials.toUpperCase()}
                              </Text>
                            </View>
                            <Text style={styles.pupilName}>
                              {displayPupilName(pupil)}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.selectionCircle,
                              isSelected && styles.selectionCircleSelected,
                            ]}
                          >
                            {isSelected && (
                              <Ionicons
                                name="checkmark"
                                size={18}
                                color="black"
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                      </View>
                    );
                  })}
                </>
              ) : (
                <>
                  {showNoResults && (
                    <View style={styles.noResultsContainer}>
                      <Text style={styles.noResultsText}>
                        No matching pupils found
                      </Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
