import React, { useRef, useState } from "react";
import { Text } from "@/components/ui/text";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
        zIndex: 50,
        height: "100%",
      }}
      enabled={true}
    >
      <View className="flex-1 bg-white">
        {/* Header with Cancel, title, and Add button */}
        <View className="relative flex-row items-center justify-center p-4 border-b border-gray-200">
          {/* Cancel Button (Left) */}
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="absolute left-4"
          >
            <Text className="text-blue-500 text-lg">Cancel</Text>
          </TouchableOpacity>

          {/* Center Title */}
          <Text className="text-black text-lg font-semibold">Choose pupil</Text>

          {/* Add Button (Right) */}
          {selectedPupils.length > 0 && (
            <TouchableOpacity
              onPress={handleAddSelectedPupils}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="absolute right-4"
            >
              <Text className="text-lg text-black">Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SearchBar component */}
        <View className="p-2 px-4 mb-3">
          <SearchBar
            placeholder="Search"
            initialValue={searchText}
            onSearch={handleTextChange}
            ref={searchInputRef}
            debounceTime={1000}
            blurOnSubmit={false}
            //isSearching={searching}
            onClearPress={() => {
              // Explicitly dismiss keyboard when X is pressed aaaaaaaaaaaaaaa
              isClearing.current = true;
              Keyboard.dismiss();
              setSearchText("");

              setTimeout(() => {
                isClearing.current = false;
              }, 300);
            }}
          />
        </View>

        {/* Selected Pupils */}
        <View>
          {selectedPupils.length > 0 && (
            <View style={{ marginBottom: 5 }}>
              <ScrollView
                horizontal
                className="pt-1 pb-1 px-2"
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
                    <View key={pupil.id} className="items-center mx-2 w-20">
                      <View className="relative">
                        <View
                          className="h-16 w-16 rounded-full overflow-hidden justify-center items-center"
                          style={{ backgroundColor: avatarColor }}
                        >
                          <Text className="text-white font-bold text-lg">
                            {initials.toUpperCase()}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            backgroundColor: "grey",
                            borderRadius: 999,
                            padding: 4,
                            zIndex: 10,
                          }}
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
                        className="text-black text-center mt-1 text-xs"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {pupil.firstName}
                      </Text>
                      <Text
                        className="text-black text-center text-xs"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {pupil.lastName}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
              <View />
            </View>
          )}

          {/* Suggested Label */}
          <Text
            className="text-gray-500 text-lg font-medium px-4 mt-0"
            style={{ marginBottom: 5 }}
          >
            Suggested
          </Text>
        </View>

        {/* Pupil List - using keyboardDismissMode="on-drag" to allow dismissal on scroll */}
        {searching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0A84FF" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
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
                        className="flex-row items-center justify-between py-3 px-3"
                        onPress={() => handleSelectPupil(pupil)}
                      >
                        <View className="flex-row items-center">
                          <View
                            className="h-12 w-12 rounded-full overflow-hidden mr-3 justify-center items-center"
                            style={{ backgroundColor: avatarColor }}
                          >
                            <Text className="text-white font-bold text-base">
                              {initials.toUpperCase()}
                            </Text>
                          </View>
                          <Text className="text-black text-base font-medium">
                            {displayPupilName(pupil)}
                          </Text>
                        </View>
                        <View
                          className={`h-7 w-7 rounded-full border ${
                            isSelected
                              ? "bg-black-500 border-black-500 items-center justify-center"
                              : "border-gray-400"
                          }`}
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
                      <View
                        className="flex-row"
                        style={{ paddingLeft: 67, paddingRight: 8 }}
                      >
                        <View className="flex-1 border-b border-gray-200"></View>
                      </View>
                    </View>
                  );
                })}
              </>
            ) : (
              <>
                {showNoResults && (
                  <View className="p-4 justify-center items-center">
                    <Text className="text-gray-500">
                      No matching pupils found
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
